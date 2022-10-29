const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/mailTo");

// SIGN JWT TOKEN BY USER ID
const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

// SIGNUP PROCESS
const signUp = async (req, res, next) => {
    try {
        const user = await User.create(req.body); // CREATE USER

        const token = signToken(user._id);  // TOKEN SIGNED BY USER ID 

        res.status(201).json({
            status: "Success",
            token,
            data: user
})
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

// LOGIN PROCESS
const login = async (req, res, next) => {
    const { email, password } = req.body;   // RECEIVE USER EMAIL AND PASSWORD

    // VALIDATE IF EMAIL AND PASSWORD EXITS
    if(!email || !password){
        return next(new AppError("Provide a valid Email and Password", 400));
    }

    try {
        const user = await User.findOne({email}).select("+password");   // CHECK EMAIL FROM DATABASE

        //  AND CHECK IF PASSWORD VALIDATE FROM USER SCHEMA METHOD
        if(!user || !(await user.validateUser(password, user.password))) {
            return next(new AppError("Incorrect Email or Password", 401))
        }
        const token = signToken(user._id); // SIGN JWT TOKEN FOR USER

        res.status(200).json({
            status: "Success",
            token,
        })
        
    }catch(err){
        next(err);
    }
}

// PROTECT ROUTES: AUTHORIZATION
const protect = async (req, res, next) => {
    let token;

    // SEARCH FOR TOKEN FROM REQUEST
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]; // GET THE TOKEN STRING
    }
    //  CHECK IF TOKEN IS AVAILABLE
    if(!token) return next(new AppError("You are not logged in", 401));
    try {
        // CHECK IF JWT TOKEN IS VALID 
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        // CHECK IF JWT TOKEN HAS A VALID USER FROM DATABASE
        const user = await User.findById(decoded.id);

        
    if(!user) return next(new AppError("User ID Incorrect", 401)); // ERROR IF INVALID USER

    // CHECK IF PASSWORD IS CHANGED
    if(!user.checkPass(decoded.iat)) return next(new AppError("User Password has been changed", 401));

    req.user = user;

    next();
    }catch(err){
        next(new AppError(err, 401))
    }
}

const restrictions = (...roles) => { 
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError("No Permissions to perform this action", 403));
        }
        next();
    }
}

const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    try{
        if(!user) return next(new AppError("No user with the provided Email Address", 404));
    
        const resetToken = user.createPasswordResetToken();

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
        console.log(resetUrl);

        const message = `follow: ${resetUrl} to change password in 10mins before it expires`;
        await sendEmail({
            email: user.email,
            subject: "Reset Password request",
            message: message
        })
        res.status(200).json({
            status: "Successful"
        })
        
    }catch(err){
        next(new AppError(err, 500));
    }
}

const resetPassword = (req, res, next) => {

}

module.exports = {
    signUp,
    login,
    protect,
    restrictions,
    forgotPassword,
    resetPassword
}
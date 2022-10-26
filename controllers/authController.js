const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("./../utils/appError");

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

module.exports = {
    signUp,
    login,
    protect
}
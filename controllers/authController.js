const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("./../utils/appError");

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

const signUp = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        const token = signToken(user._id);

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

const login = async (req, res, next) => {
    const { email, password } = req.body;

    // CHECK IS EMAIL AND PASSWORD EXITS
    if(!email || !password){
        return next(new AppError("Provide a valid Email and Password", 400));
    }

    try {
        const user = await User.findOne({email}).select("+password");

        if(!user || !(await user.validateUser(password, user.password))) {
            return next(new AppError("Incorrect Email or Password", 401))
        }
        const token = signToken(user._id);

        res.status(200).json({
            status: "Success",
            token,
        })
        
    }catch(err){
        next(err);
    }
}

const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    //  CHECK IF TOKEN IS AVAILABLE
    if(!token) return next(new AppError("You are not login", 401));
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        // CHECK IF JWT IS A VALID USER ID SIGNATURE
        const user = await User.findById(decoded.id);

        
    if(!user) return next(new AppError("User ID Incorrect", 401));

    // CHECK PASSWORD CHANGED
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
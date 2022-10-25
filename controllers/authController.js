const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("./../utils/appError");

const signToken = id => {
    return jwt.sign({id: id}, "secret", {expiresIn: "3d"});
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


module.exports = {
    signUp,
    login
}
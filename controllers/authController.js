const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/mailTo");
const asyncHandler = require("./../utils/asyncHandler")


// SIGN JWT TOKEN BY USER ID
const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

// SIGNUP PROCESS
const signUp = asyncHandler(async (req, res, next) => {
    if(req.body.role) return next(new AppError("Can't Specify role", 400))
    const user = await User.create(req.body); // CREATE USER

    const token = signToken(user._id);  // TOKEN SIGNED BY USER ID 
    res.cookie("JWT", token, {
        expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        // secure: true, // https only
        httpOnly: true
    })
    res.status(201).json({
        status: "Success",
        token,
        data: user
    })
})

// LOGIN PROCESS
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;   // RECEIVE USER EMAIL AND PASSWORD

    // VALIDATE IF EMAIL AND PASSWORD EXITS
    if(!email || !password){
        return next(new AppError("Provide a valid Email and Password", 400));
    }

        const user = await User.findOne({email}).select("+password");   // CHECK EMAIL FROM DATABASE

        //  AND CHECK IF PASSWORD VALIDATE FROM USER SCHEMA METHOD
        if(!user || !(await user.validateUser(password, user.password))) {
            return next(new AppError("Incorrect Email or Password", 401))
        }
        const token = signToken(user._id); // SIGN JWT TOKEN FOR USER
        res.cookie("JWT", token, {
            expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            // secure: true, // https only
            httpOnly: true
        })
        res.status(200).json({
            status: "Success",
            token,
        })
})

// LOG OUT
const logOut = (req, res, next) => {
    res.cookie("JWT", "logged out", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: "Success"})
}

// CHECK IS LOGGED IN FOR EVERY REQUEST
// PROTECT ROUTES: AUTHORIZATION
const isLoggedIn = async (req, res, next) => {
    try{
        if(req.cookies.JWT){ // AUTH WITH JWT COOKIES
            const decoded = await promisify(jwt.verify)(req.cookies.JWT, process.env.JWT_SECRET);
            
            // CHECK IF JWT TOKEN HAS A VALID USER FROM DATABASE
            const user = await User.findById(decoded.id);
    
            
        if(!user) return next(); // ERROR IF INVALID USER
    
        // CHECK IF PASSWORD IS CHANGED
        if(!user.checkPass(decoded.iat)) return next();
    
        // VALIDE LOGGED IN USER
        res.locals.user = user
        return next()
    }
        next();
    }catch(err){
        return next()
    }
}

// PROTECT ROUTES: AUTHORIZATION
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // SEARCH FOR TOKEN FROM REQUEST
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]; // GET THE TOKEN STRING
    }else if(req.cookies.JWT){ // AUTH WITH JWT COOKIES
        token = req.cookies.JWT
    }

    //  CHECK IF TOKEN IS AVAILABLE
    if(!token) return next(new AppError("You are not logged in", 401));
        // CHECK IF JWT TOKEN IS VALID 
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        // CHECK IF JWT TOKEN HAS A VALID USER FROM DATABASE
        const user = await User.findById(decoded.id);

        
    if(!user) return next(new AppError("User Do not longer exist", 401)); // ERROR IF INVALID USER

    // CHECK IF PASSWORD IS CHANGED
    if(!user.checkPass(decoded.iat)) return next(new AppError("User Password has been changed", 401));

    req.user = user;
    res.locals.user = user
    next();
})

// RESTRICT ROLES OF USERS
const restrictions = (...roles) => { 
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError("No Permissions to perform this action", 403));
        }
        next();
    }
}

// FORGOT PASSWORD FUNCTIONALITY
const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})
        if(!user) return next(new AppError("No user with the provided Email Address", 404)); // VALIDATE USER EXISTENCE
    
        const resetToken = user.createPasswordResetToken(); // CREATE TOKEN

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

        const message = `follow: ${resetUrl} to change password in 10mins before it expires. Please ignore if you did not request for a password`;
        try{ // SEND TOKEN TO USER THROUGH EMAIL
            await sendEmail({
                email: user.email,
                subject: "Reset Password request",
                message: message
            })
            res.status(200).json({
                status: "Successful",
                message: "Mail sent successfully"
            })

        }catch(err){
            // RESET ALL IF AN ERROR OCCURED
            user.passwordResetToken = undefined;
            user.passwordResetTimer = undefined;
            await user.save({ validateBeforeSave: false});

            return next(new AppError("There was a problem resetting the password. please try again later", 500));
        }
})

// RESET PASSWORD FUNCTIONALITY
const resetPassword = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); // CREATE HASH FOR PASS
        const user = await User.findOne({passwordResetToken: hashedToken, passwordResetTimer: { $gt: Date.now() }})
    
        if(!user) return next(new AppError("Token is invalid or Expired", 400)); // CONFIRM IF TOKEN EXIST IN DATABASE
    
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetTimer = undefined;
        user.passwordResetToken = undefined;
        await user.save();

        const token = signToken(user._id); 

        res.status(200).json({
            message: "Successful",
            token
        })
})

// UPDATE USER PASSWORD WHILE LOGGED IN
const updatePassword = asyncHandler(async (req, res, next) => {
    // user input
    const { oldPass, password, confirmPassword } = req.body;
     
    if(!oldPass || !password || !confirmPassword) return next(new AppError("Please enter required field", 400));

    const userDetails = req.user;  // GET LOGGED IN USER DETAILS
        const user = await User.findById(userDetails._id).select("+password");
        
        const compare = await user.validateUser(oldPass, user.password); 
        
        if(!compare) return next(new AppError("Your old password is not correct", 400));
        
        user.password = password;
        user.confirmPassword = confirmPassword;
        const token = signToken(user._id); // SIGN JWT TOKEN FOR USER
        
        await user.save({ runValidator: true})
        //console.log(confirmPasskey);
        res.status(200).json({
            status: "Success",
            token
        })
})

module.exports = {
    signUp,
    login,
    protect,
    restrictions,
    forgotPassword,
    resetPassword,
    updatePassword,
    isLoggedIn,
    logOut
}
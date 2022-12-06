const AppError = require("../utils/appError")

function handleCastError(err){
    const message = `invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

function handleDuplicateError(err){
    const message = `Key ${err.keyValue.name}: already exist in database`
    return new AppError(message, 400)
}

function handleValidationError(err){
    const values = Object.values(err.errors).map(el => el.message)
    const message = values.join(". ")
    return new AppError(message, 400)
}

function handleJwtError(){
    return new AppError("Login Token is invalid please Try again later", 401)
}

function handleJwtExpires(){
    return new AppError("Login Token Expired, please login again", 401)
}

// ERROR VIEWS FOR DEVELOPMENT
const development = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

// ERROR VIEWS FOR PRODUCTION
const production = (err, res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else{
        console.error("Error: " +  err)

        res.status(500).json({
            status: "Error",
            message: "An Error Occured, please Try back later"
        })
    }
}

// EXPORT ERROR HANDLER TO APP
module.exports = (err, req, res, next) => {
     err.statusCode = err.statusCode || 500;
     err.status = err.status || "Error"
    
    if(process.env.NODE_ENV !== "production"){ // DEVELOPMENT ERRORS
        development(err, res)
    }else { // PRODUCTION ERRORS
        // VALIDATE NON OPERAIONAL ERROR AND CONVERT 
        let error = {...err}
        if(error.name === "CastError"){ error = handleCastError(error) }
        if(error.code === 11000) { error = handleDuplicateError(error) }
        if(error.errors) { error = handleValidationError(error) }
        if(error.name === "JsonWebTokenError") error = handleJwtError()
        if(error.name === "TokenExpiredError") error = handleJwtExpires()

        production(error, res)
    }      
}
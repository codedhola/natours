const AppError = require("../utils/appError")

const development = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

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

function handleCastError(err){
    const message = `invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}


module.exports = (err, req, res, next) => {
     err.statusCode = err.statusCode || 500;
     err.status = err.status || "Error"
    
    if(process.env.NODE_ENV !== "production"){
        development(err, res)
    }else {
        let error = {...err}
        if(error.name = "CastError") error = handleCastError(err)
        production(error, res)
    }      
}
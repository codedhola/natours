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
        res.status(statusCode).json({
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

module.exports = (err, req, res, next) => {
     err.statusCode = err.statusCode || 500;
     err.status = err.status || "Error"
    
    if(process.env.NODE_ENV !== "production"){
        development(err, res)
    }else {
        production(err, res)
    }      
}
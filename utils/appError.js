class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        // super()
        // this.message = message
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startswith("4") ? "Fail" : "Error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
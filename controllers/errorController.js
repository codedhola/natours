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
const development = (err, req, res) => {
     // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
}

// ERROR VIEWS FOR PRODUCTION
const production = (err, req, res) => {
    // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
}

// EXPORT ERROR HANDLER TO APP
module.exports = (err, req, res, next) => {
     err.statusCode = err.statusCode || 500;
     err.status = err.status || "Error"
    
    if(process.env.NODE_ENV !== "production"){ // DEVELOPMENT ERRORS
        development(err, req, res)
    }else { // PRODUCTION ERRORS
        // VALIDATE NON OPERAIONAL ERROR AND CONVERT 
        let error = {...err}
        if(error.name === "CastError"){ error = handleCastError(error) }
        if(error.code === 11000) { error = handleDuplicateError(error) }
        if(error.errors) { error = handleValidationError(error) }
        if(error.name === "JsonWebTokenError") error = handleJwtError()
        if(error.name === "TokenExpiredError") error = handleJwtExpires()

        production(error, req, res)
    }      
}
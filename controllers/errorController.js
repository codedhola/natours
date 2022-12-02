module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "Error"
    console.log(status);

    res.status(statusCode).json({
        status: status,
        message: err.message
    })
    next();
}
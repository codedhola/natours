// IMPORT ALL NECCESSARY MODULES
const express = require("express");
const app = express();
const morgan = require("morgan");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const AppError = require("./utils/appError");

app.use(express.json()); // USE JSON MIDDLEWARE TO PARSE JSON DATA

if(process.env.NODE_ENV){
    app.use(morgan("dev"));
}

// ROUTE MIDDLEWARE
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} can't be found on the server`);
    err.statusCode = 404;
    err.status = "fail";
    next(err);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "Error";

    res.status(statusCode).json({
        status: status,
        message: err.message
    })
    next();
})

module.exports = app;
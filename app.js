// IMPORT ALL NECCESSARY MODULES
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController")

app.use(helmet()); // HELMET TO SECURE HEADERS
const limiter = rateLimit({ // RATE-LIMIT FOR SECURITY
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request, please try again in an hour"
});

app.use(express.json({limit: "10kb"})); // USE JSON MIDDLEWARE TO PARSE JSON DATA

// DATA SANITIZATION 
app.use(mongoSanitize());   // SANITIZE MONGODB 

app.use(xss());             // SANITIZE CLIENT-SIDE INPUTS

app.use(hpp({
    whitelist: ["duration", "ratingsAverage", "ratingsQuantity", "difficulty", "price"]
}));             // PARAMETER POLUTION HELPER

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}

app.use("/api", limiter) // SECURE ALL 'API' ENDPOINTS FROM BRUTE-FORCE ATTACKS

// ROUTE MIDDLEWARE
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} can't be found on the server`, 404);  // Better Error Handler
    next(err);
})

app.use(errorHandler)

module.exports = app;
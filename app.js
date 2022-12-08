// IMPORT ALL NECCESSARY MODULES
const express = require("express");
const app = express();
const morgan = require("morgan");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController")
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


app.use(helmet()); // HELMET TO SECURE HEADERS
const limiter = rateLimit({ // RATE-LIMIT FOR SECURITY
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request, please try again in an hour"
})

app.use(express.json({limit: "10kb"})); // USE JSON MIDDLEWARE TO PARSE JSON DATA

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
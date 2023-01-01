// IMPORT ALL NECCESSARY MODULES
const path = require("path")
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const viewsRoutes = require("./routes/viewsRoutes");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const app = express();

// VIEWS 
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

// STATIC FILES FOR PUBLIC USE
app.use(express.static(path.join(__dirname, "public")))

// app.use(helmet()); // HELMET TO SECURE HEADERS
app.use(helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
            allowOrigins: ['*']
        },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['*'],
                scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"]
            }
        }
    }))

const limiter = rateLimit({ // RATE-LIMIT FOR SECURITY
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request, please try again in an hour"
});

app.use(express.json({limit: "15kb"})); // USE JSON MIDDLEWARE TO PARSE JSON DATA
app.use(cookieParser());

// DATA SANITIZATION 
app.use(mongoSanitize());   // SANITIZE MONGODB 

app.use(xss());             // SANITIZE CLIENT-SIDE INPUTS

app.use(hpp({
    whitelist: ["duration", "ratingsAverage", "ratingsQuantity", "difficulty", "price"]
}));             // PARAMETER POLUTION HELPER

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}

app.use("/", viewsRoutes)

app.use("/api", limiter) // SECURE ALL 'API' ENDPOINTS FROM BRUTE-FORCE ATTACKS

// ROUTE MIDDLEWARE
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} can't be found on the server`, 404);  // Better Error Handler
    next(err);
})

app.use(errorHandler)

module.exports = app;
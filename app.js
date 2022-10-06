const express = require("express");
const app = express();
const morgan = require("morgan");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");


app.use(express.json());

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV){
    app.use(morgan("dev"));
}

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);


module.exports = app;
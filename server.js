const express = require("express");
const dotenv = require("dotenv").config({path: "./config.env"});
const morgan = require("morgan");
const app = require("./app");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");


app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
console.log(process.env)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server instance successful... on port " + port);
})

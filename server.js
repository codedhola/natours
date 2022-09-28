const express = require("express");
const morgan = require("morgan");

const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server instance successful...");
})
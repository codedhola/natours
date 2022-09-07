const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

const filePath = path.join(__dirname, "dev-data/data", "tours.json");
const fileData = fs.readFileSync(filePath, "utf-8");


app.get("/api/v1/", (req, res) => {
    const data = JSON.parse(fileData);
    res.status(200).json({
        "status" : "success",
        "length" : data.length,
        "data" : data
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server instance successful...");
})
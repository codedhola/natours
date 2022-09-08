const fs = require("fs");

const express = require("express");
const app = express();

app.use(express.json());

const fileData = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8");


app.get("/api/v1/tours", (req, res) => {
    const data = JSON.parse(fileData);
    res.status(200).json({
        "status" : "success",
        "length" : data.length,
        "data" : data
    });
});

app.post("/api/v1/tours", (req, res) => {
    const getTours = req.body;
    const allData = JSON.parse(fileData);

    // TOURS TO ADD 
    const id = allData.length;
    tour = {id, ...getTours};

    allData.push(tour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(allData), (error) => {
        if(error) throw error;
    });
    
    res.send(tour); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server instance successful...");
})
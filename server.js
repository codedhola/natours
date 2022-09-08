const fs = require("fs");

const express = require("express");
const app = express();

app.use(express.json());

const fileData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"));

// MIDDLEWARE TO SHOW TIMER => <REQ.TIMER>
app.use((req, res, next) => {
    const timer = new Date();
    req.timer = timer.toLocaleString();
    next();
});


const getAllTours = (req, res) => {
    const data = fileData;
    console.log(req.timer)
    res.status(200).json({
        "status" : "success",
        "length" : data.length,
        "data" : data
    });
};

const createTour = (req, res) => {
    const getTours = req.body;
    const allData = fileData;

    // TOURS TO ADD 
    const id = allData.length;
    tour = {id, ...getTours};

    allData.push(tour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(allData), (error) => {
        if(error) throw error;
    });
    
    res.send(tour); 
};

const getTourById = (req, res) => {
    const param = req.params;
    const tour = fileData.find(el => el.id == param.id);
    //  TOUR RECEIVES A PARTICULAR ID TOUR
    if(!tour){
        return res.status(404).send({
            status: "unsuccessful",
            message: "couldn't find the tour with the given id"
        })
    }
    res.status(200).send({
        status: "success",
        data: {
            tour
        }
    });
}

const editTour = (req, res) => {
    const param = req.params;
    const tour = fileData.find(el => el.id == param.id);

    if(!tour){
        return res.status(404).send({
            status: "unsuccessful",
            message: "Couldn't Find the tour to edit"
        })
    }
    res.send("EDITING");
};

const deleteTour = (req, res) => {
    const param = req.params;
    const tour = fileData.find(el => el.id == param.id);

    if(!tour){
        return res.status(404).send({
            status: "unsuccessful",
            message: "Couldn't Find the tour to delete"
        })
    }
    res.send("DELETING");
};

// GET ALL TOUR
app.get("/api/v1/tours", getAllTours);

// CREATE A TOUR
app.post("/api/v1/tours", createTour);

// GET A TOUR BY ID
app.get("/api/v1/tours/:id", getTourById);

// EDIT A TOUR BY ID
app.patch("/api/v1/tours/:id", editTour);

// DELETE A TOUR BY ID
app.delete("/api/v1/tours/:id", deleteTour);



app.listen(process.env.PORT || 3000, () => {
    console.log("Server instance successful...");
})
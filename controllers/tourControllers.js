// TOUR CONTROLLER FUNCTION
const fs = require("fs");
const Tour = require("./../model/tourModel");

//const fileData = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`, "utf-8"));


// const checkId = (req, res, next, val) => {
//     const tour = fileData.find(el => el.id == val);
//     //  TOUR RECEIVES A PARTICULAR ID TOUR
//     if(!tour){
//         return res.status(404).send({
//             status: "unsuccessful",
//             message: "couldn't find the tour with the given id"
//         })
//     }
//     console.log(val)
//     next();
// }



// const checkBody = (req, res, next) => {
//     const {name, difficulty, price} = req.body;
//     if(!name || !difficulty || !price){
//         return res.status(400).json({
//             Status: "Bad request",
//             message: "request incoming not completely validated"
//         });
//     }
//     const body = {name , difficulty, price}
//     console.log(body);
//     next();
// }

const getAllTours = (req, res) => {
    
};

const createTour = async (req, res) => {
    const body = req.body;
    const doc = await Tour.create(body);
    res.send(doc);
    
};

const getTourById = (req, res) => {
    
}

const editTour = (req, res) => {
    
    res.send("EDITING");
};

const deleteTour = (req, res) => {
    
    res.send("DELETING");
};


module.exports = {
    getAllTours,
    createTour,
    getTourById,
    editTour,
    deleteTour
}
// TOUR CONTROLLER FUNCTION
const { json } = require("express")
const fs = require("fs")
const Tour = require("./../model/tourModel")

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

const getAllTours = async (req, res) => {
    try {
        const queryObj = {...req.query};
        let excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach(el => delete queryObj[el])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, arg => `$${arg}`)
        console.log(queryStr)
        
        const query = Tour.find(JSON.parse(queryStr));
        console.log(queryObj)
        // AWAIT TOUR QUERY
        const tour = await query;

        res.status(200).json({
            status: "success",
            results: tour.length,
            data: {
                tours: tour
            }
        })
    }catch(err){
        res.status(400).json({
            status: "Failure",
            message: err.message
        })
    }
    
}

const createTour = async (req, res) => {

    const body = req.body;
    try{
        const newTour = await Tour.create(body);
        res.status(201).json({
            status: "success",
            data: {
                doc: newTour
            }
        });
    }catch(err){
        res.status(400).json({
            status: "error",
            message: err.message
        })
    }
};

const getTourById = async (req, res) => {
    const tourId = req.params.id
    try{
        const tour = await Tour.findById(tourId)
        if(!tour) return res.status(404).json("Not found")
        res.status(200).json({
            status: "Sucessful",
            data: tour
        })
    }catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }

}

const editTour = async (req, res) => {
    const tourId = req.params.id;
    try{
        const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
            new: true,
        })
        res.status(200).json({
            status: "Successful",
            message: tour
        })
    }catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }
};

const deleteTour = async (req, res) => {
    try{
        const tourId = req.params.id;
        await Tour.findByIdAndDelete(tourId);
        res.status(204).json()
    }catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }

};


module.exports = {
    getAllTours,
    createTour,
    getTourById,
    editTour,
    deleteTour
}
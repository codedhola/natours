// TOUR CONTROLLER FUNCTION
const { aggregate } = require("./../model/tourModel");
const Tour = require("./../model/tourModel")
const APIFeatures = require("./../utils/apiFeatures")  // APIFEATURE CLASS

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
        // QUERYING
        // const queryObj = {...req.query};
        // let excludeFields = ["page", "sort", "limit", "fields"]
        // excludeFields.forEach(el => delete queryObj[el])

        // // PARSE AND REPLACE QUERY FOR SEARCH IN DATABASE
        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, arg => `$${arg}`) //CORRESPOND QUERY TO MONGODB

        // console.log(queryStr)
        // // SEARCH OR QUERY(IF FOUND) IN DATABASE
        // let query = Tour.find(JSON.parse(queryStr))

        const features = new APIFeatures(Tour.find(), req.query).Filter().Sort().Fields().Pagination()

        //SORTING
        // if(req.query.sort){
        //     const sortby = req.query.sort.split(",").join(" ")
        //     query = query.sort(sortby)
        // }else {
        //     query = query.sort("-createdAt")
        // }

        // FIELD LIMITING
        // if(req.query.fields){
        //     let fields = req.query.fields.split(",").join(" ")
        //     query = query.select(fields);
        // }else {
        //     query = query.select("-__v")
        // }

        // const page = (req.query.page * 1) || 1;
        // const limit = (req.query.limit * 1) || 4;
        // const skip = (page - 1) * limit;

        // // IMPLEMENTING PAGINATION
        // query = query.skip(skip).limit(limit);

        // if(req.query.page){
        //     const numTour = await Tour.countDocuments();
        //     if(skip >= numTour) throw new Error("This page havent been created yet");
        // }
        // AWAIT TOUR QUERY
        const tour = await features.Query;

        // RESULT 
        res.status(200).json({
            status: "success",
            results: tour.length,
            data: {
                tours: tour
            }
        })
    }catch(err){ // FAILURE
        res.status(400).json({
            status: "Failure",
            message: err.message
        })
    }
    
}

const topBest = async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-price,ratingsAverage";
    req.query.fields = "name,price,summary,difficulty,ratingsAverage";
    next();
}

const createTour = async (req, res) => {
    // GET DATA FROM USERS
    const body = req.body;
    try{
        // PARSE DATA TO DATABASE
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
        // SEARCH DATABASE BASED ON GIVEN ID
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
        // EDIT DATA BASED ON GIVEN ID FROM USERS
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
        // DELETE DATA BASED ON ID FROM USERS
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

const getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: "$difficulty",
                    numTours: { $sum: 1},
                    avgRating: { $avg: "$ratingsAverage"},
                    avgPrice: { $avg: "$price"},
                    avgRate: { $avg: "$ratingsQuantity"},
                    minPrice: { $min: "$price"},
                    maxPrice: { $max: "$price"},
                    inStock: { $sum: "$ratingsQuantity"}
                }
            },
            {
                $sort: { avgPrice: 1}
            }
        ])

        res.status(200).json({
            status: "Successful",
            results: stats.length,
            data: stats
        })
    }catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }
    
}


const getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        console.log(new Date(`${year}-01-01`))
        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates"
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }   
                }
            }
            ,
            {
                $group: {
                    _id: { $month: "$startDates"},
                    numTourStarts: { $sum: 1},
                    tours: { $push: "$name"}
                }
            },
            {
                $addFields: {
                    month: "$_id"
                }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numToursStarts: 1}
            },
            {
                $limit: 5
            }
        ]);
        res.status(200).json({
            status: "Successful",
            result: plan.length,
            data: {
                plan
            }
        })

    }catch(err){
        res.status(400).json({
            status: "Fail",
            message: err.message
        })
    }
}

// EXPORT ALL CONTROLLER FUNCTION 
module.exports = {
    getAllTours,
    createTour,
    getTourById,
    editTour,
    deleteTour,
    topBest,
    getTourStats,
    getMonthlyPlan
}
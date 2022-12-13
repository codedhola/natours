// TOUR CONTROLLER FUNCTION
const Tour = require("./../model/tourModel")
const APIFeatures = require("./../utils/apiFeatures")  // APIFEATURE CLASS
const AppError = require("./../utils/appError")
const catchAsync = require("./../utils/asyncHandler")

const getAllTours = catchAsync(async (req, res) => {
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
});

const topBest = catchAsync(async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-price,ratingsAverage";
    req.query.fields = "name,price,summary,difficulty,ratingsAverage";
    next();
})

const createTour = catchAsync(async (req, res, next) => {
    // GET DATA FROM USERS
    const body = req.body;
        // PARSE DATA TO DATABASE
        const newTour = await Tour.create(body);
        res.status(201).json({
            status: "success",
            data: {
                doc: newTour
            }
        });
});

const getTourById = catchAsync(async (req, res, next) => {
    const tourId = req.params.id
        // SEARCH DATABASE BASED ON GIVEN ID
        const tour = await Tour.findById(tourId).select("-__v").populate({
            path: "guides",
            select: "-__v"
        })
        const err =  new AppError(`Tour with ID ${tourId} Not found`, 404)
        if(!tour) return next(err);
        res.status(200).json({
            status: "Sucessful",
            data: tour
        })
})

const editTour = catchAsync(async (req, res) => {
    const tourId = req.params.id
        // EDIT DATA BASED ON GIVEN ID FROM USERS
        const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
            new: true,
            runValidators: true
        })
        if(!tour) return next(new AppError(`Tour with id ${tourId} not Found`, 404))
        res.status(200).json({
            status: "Successful",
            message: tour
        })
})

const deleteTour = catchAsync(async (req, res, next) => {
        // DELETE DATA BASED ON ID FROM USERS
        const tourId = req.params.id;
        const tour = await Tour.findByIdAndDelete(tourId);
        if(!tour) return next(new AppError("Tour with given ID not Found", 404))
        res.status(204).json()
})

const getTourStats = catchAsync(async (req, res) => {
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
})


const getMonthlyPlan = catchAsync(async (req, res) => {
        const year = req.params.year * 1;
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
})

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
const asyncHandler = require("./../utils/asyncHandler")
const Review = require("./../model/reviewModel")

const getAllReviews = asyncHandler(async(req, res, next) => {
    console.log("Reviews loading...")
    const reviews = await Review.find();
    res.status(200).json({
        status: "Successful",
        message: "Reviews ...",
        result: reviews
    })
})

const getReviewById = asyncHandler(async(req, res, next) => {
    const id = req.params.reviewId
    console.log(id)
    const review = await Review.findById(id).populate({
        path: "tour",
        select: "-__v"
    }).populate({
        path: "user",
        select: "-__v -role -changePasswordAt "
    })
    res.status(200).json({
        status: "Successful",
        result: review
    })
})

const postReview = asyncHandler(async(req, res, next) => {
    console.log(req.params)
    if(!req.body.tour) req.body.tour = req.params.id
    if(!req.body.user) req.body.user = req.user   
    const review = await Review.create(req.body)
    res.status(200).json({
        status: "Successful",
        result: review
    })
})

const editReview = asyncHandler(async(req, res, next) => {
    const id = req.params.id
    const review = await Review.findByIdAndUpdate(id, req. body)
    res.status(200).json({
        status: "Successful",
        result: review
    })
})

const deleteReview = asyncHandler(async(req, res, next) => {
    const id = req.params.id
    await Review.findByIdAndDelete(id)
    res.status(204).json({
        status: "Successful"
    })
})

module.exports = {
    getAllReviews,
    getReviewById,
    postReview,
    editReview,
    deleteReview
}
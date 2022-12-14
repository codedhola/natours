const asyncHandler = require("./../utils/asyncHandler")
const Review = require("./../model/reviewModel");
const AppError = require("../utils/appError");

const getAllReviews = asyncHandler(async(req, res, next) => {
    const tour = req.params.tourId
    const reviews = await Review.find({tour});
    res.status(200).json({
        status: "Successful",
        result: reviews
    })
})

const getReviewById = asyncHandler(async(req, res, next) => {
    const id = req.params.reviewId
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
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user   
    const review = await Review.create(req.body)
    res.status(200).json({
        status: "Successful",
        result: review
    })
})

const editReview = asyncHandler(async(req, res, next) => {
    const id = req.params.reviewId
    if(!id) return next(new AppError("Reviews is broken", 404))
    const review = await Review.findByIdAndUpdate(id, req. body)
    res.status(200).json({
        status: "Successful",
        result: review
    })
})

const deleteReview = asyncHandler(async(req, res, next) => {
    const id = req.params.reviewId
    if(!id) return next(new AppError("Review link is broken ", 404))
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
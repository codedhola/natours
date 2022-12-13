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
    const id = req.body.id
    const review = await Review.findById(id)
    res.status(200).json({
        status: "Successful",
        message: "Reviews ...",
        result: reviews
    })
})

const postReview = asyncHandler(async(req, res, next) => {
    
    const review = await Review.create(req. body)
    res.status(200).json({
        status: "Successful",
        result: review
    })

})

module.exports = {
    getAllReviews,
    getReviewById,
    postReview
}
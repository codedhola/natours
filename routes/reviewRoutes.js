const router = require("express").Router()
const {getAllReviews, getReviewById, postReview} = require("./../controllers/reviewControllers")

router.get("/", getAllReviews)

router.get("/:id", getReviewById)

router.post("/", postReview)

module.exports = router
const router = require("express").Router()
const {getAllReviews, getReviewById, postReview, deleteReview, editReview} = require("./../controllers/reviewControllers")

router.get("/", getAllReviews)

router.get("/:id", getReviewById)

router.post("/", postReview)

router.patch("/:id", editReview)

router.delete("/:id", deleteReview)
module.exports = router
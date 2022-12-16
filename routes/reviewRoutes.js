const router = require("express").Router({ mergeParams: true})
const {getAllReviews, getReviewById, postReview, deleteReview, editReview} = require("./../controllers/reviewControllers")
const { protect, restrictions } = require("./../controllers/authController")

router.get("/", getAllReviews)

router.post("/", protect, restrictions("user"), postReview)

router.get("/:reviewId", protect, restrictions("user"), getReviewById)

router.patch("/:reviewId", protect, restrictions("user"), editReview)

router.delete("/:reviewId", protect, restrictions("user"), deleteReview)

module.exports = router
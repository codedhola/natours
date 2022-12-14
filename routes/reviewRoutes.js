const router = require("express").Router()
const {getAllReviews, getReviewById, postReview, deleteReview, editReview} = require("./../controllers/reviewControllers")
const { protect, restrictions } = require("./../controllers/authController")

router.get("/", getAllReviews)

router.get("/:id", getReviewById)

router.post("/", protect, restrictions("user"), postReview)

router.patch("/:id", protect, restrictions("user"), editReview)

router.delete("/:id", protect, restrictions("user"), deleteReview)

module.exports = router
const express = require("express");
const router = express.Router();
const { getAllTours, createTour, getTourById, editTour, deleteTour, topBest, getTourStats, getMonthlyPlan, getToursWithin, getToursDistance} = require("../controllers/tourControllers");
const { uploadTourPhoto, resizeTourPhoto } = require("../utils/multer");
const {protect, restrictions} = require("./../controllers/authController");
const reviewRoutes = require("./../routes/reviewRoutes")

router.use("/:tourId/reviews", reviewRoutes)

// GET ALL TOUR
router.get("/", getAllTours);

// GEOSPATIAL QUERY
router.get("/tours-within/:distance/center/:latlng/unit/:unit", getToursWithin)

//
router.get("/distances/:latlng/unit/:unit", getToursDistance)

// ALIAS TOP BEST ROUTE 
router.get("/top-best", topBest, getAllTours);

// GET ALL TOUR STATS
router.get("/tour-stats", getTourStats);

// GET MONTHLY PLANS DETAILS
router.get("/tour-stats/:year", getMonthlyPlan);

// CREATE A TOUR
router.post("/", protect, restrictions("admin"), createTour);

// GET A TOUR BY ID
router.get("/:id", getTourById);

// EDIT A TOUR BY ID
router.patch("/:id", protect, restrictions("admin"), uploadTourPhoto, resizeTourPhoto, editTour);

// DELETE A TOUR BY ID
router.delete("/:id", protect, restrictions("admin"), deleteTour);

module.exports = router;
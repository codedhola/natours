const express = require("express");
const router = express.Router();
const { getAllTours, createTour, getTourById, editTour, deleteTour, topBest, getTourStats, getMonthlyPlan} = require("../controllers/tourControllers");
const {protect} = require("./../controllers/authController");

// GET ALL TOUR
router.get("/", protect, getAllTours);

// ALIAS TOP BEST ROUTE 
router.get("/top-best", topBest, getAllTours);

// GET ALL TOUR STATS
router.get("/tour-stats", getTourStats);

// GET MONTHLY PLANS DETAILS
router.get("/tour-stats/:year", getMonthlyPlan);

// CREATE A TOUR
router.post("/", createTour);

// GET A TOUR BY ID
router.get("/:id", getTourById);

// EDIT A TOUR BY ID
router.patch("/:id", editTour);

// DELETE A TOUR BY ID
router.delete("/:id", deleteTour);

module.exports = router;
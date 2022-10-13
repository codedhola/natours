const express = require("express");
const router = express.Router();
const { getAllTours, createTour, getTourById, editTour, deleteTour, topBest, getTourStats, getMonthlyPlan} = require("../controllers/tourControllers");

// PARAM MIDDLE-WARE FOR ID;

// GET ALL TOUR
router.get("/", getAllTours);

// ALIAS TOP BEST ROUTE 
router.get("/top-best", topBest, getAllTours);

// 
router.get("/tour-stats", getTourStats);

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
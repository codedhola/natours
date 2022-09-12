const express = require("express");
const router = express.Router();
const { getAllTours, createTour, getTourById, editTour, deleteTour, checkId } = require("../controllers/tourControllers");

router.param("id", checkId);

// GET ALL TOUR
router.get("/", getAllTours);

// CREATE A TOUR
router.post("/", createTour);

// GET A TOUR BY ID
router.get("/:id", getTourById);

// EDIT A TOUR BY ID
router.patch("/:id", editTour);

// DELETE A TOUR BY ID
router.delete("/:id", deleteTour);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, getUserById, editUser, deleteUser } = require("../controllers/userControllers");
const { signUp, login } = require("../controllers/authController");

// GET ALL USER
router.get("/", getAllUsers);

// CREATE A USER
router.post("/", createUser);

// GET A USER BY ID
router.get("/:id", getUserById);

// EDIT A USER BY ID
router.patch("/:id", editUser);

// DELETE A USER BY ID
router.delete("/:id", deleteUser);

router.post("/signup", signUp);

router.post("/login", login);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, getUserById, editUser, deleteUser, checkProfile, updateUserProfile, deleteMe } = require("../controllers/userControllers");
const { signUp, login, forgotPassword, resetPassword, updatePassword } = require("../controllers/authController");
const { protect, restrictions } = require("./../controllers/authController");

// GET ALL USER
router.get("/", getAllUsers);

// CREATE A USER
router.post("/", createUser);

// VIEW PROFILE
router.get("/profile", protect, checkProfile)

// SIGNUP A USER
router.post("/auth/signup", signUp);

// LOGIN USER
router.post("/auth/login", login);

// FORGOT PASSWORD
router.post("/auth/forgotPassword", forgotPassword);

// RESET PASSWORD
router.patch("/auth/resetPassword/:token", resetPassword);

// UPDATE PASSWORD
router.patch("/auth/updatepassword", protect , updatePassword);

// UPDATE USER DETAILS
router.patch("/auth/updateprofile", protect, updateUserProfile);

// DELETE ME ROUTE
router.delete("/auth/deleteMe", protect, deleteMe);

// GET A USER BY ID
router.get("/:id", getUserById);

// EDIT A USER BY ID
router.patch("/:id", editUser);

// DELETE A USER BY ID
router.delete("/:id",protect, restrictions("admin", "lead"), deleteUser);
module.exports = router;
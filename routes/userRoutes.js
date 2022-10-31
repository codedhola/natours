const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, getUserById, editUser, deleteUser, updateUserProfile } = require("../controllers/userControllers");
const { signUp, login, forgotPassword, resetPassword, updatePassword } = require("../controllers/authController");
const { protect, restrictions } = require("./../controllers/authController");

// GET ALL USER
router.get("/", getAllUsers);

// CREATE A USER
router.post("/", createUser);

// GET A USER BY ID
router.get("/:id", getUserById);

// EDIT A USER BY ID
router.patch("/:id", editUser);

// DELETE A USER BY ID
router.delete("/:id",protect, restrictions("admin", "lead"), deleteUser);

// SIGNUP A USER
router.post("/signup", signUp);

// LOGIN USER
router.post("/login", login);

// FORGOT PASSWORD
router.post("/forgotPassword", forgotPassword);

// RESET PASSWORD
router.patch("/resetPassword/:token", resetPassword);

// UPDATE PASSWORD
router.patch("/auth/updatepassword", protect , updatePassword);

// UPDATE USER DETAILS
router.patch("/auth/updateprofile", protect, updateUserProfile );

module.exports = router;
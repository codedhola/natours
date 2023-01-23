const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, getUserById, editUser, deleteUser, checkProfile, updateUserProfile, deleteMe } = require("../controllers/userControllers");
const { signUp, login, forgotPassword, resetPassword, updatePassword, logOut } = require("../controllers/authController");
const { protect, restrictions } = require("./../controllers/authController");
const { uploadUserPhoto } = require("./../utils/multer")

// GET ALL USER
router.get("/", protect, restrictions("admin"), getAllUsers);

// ADMIN CREATE A USER
router.post("/", createUser);

// VIEW PROFILE
router.get("/profile", protect, checkProfile)

// SIGNUP A USER
router.post("/auth/signup", signUp);

// LOGIN USER
router.post("/auth/login", login);

// LOG OUT USER
router.get("/auth/logout", logOut);

// FORGOT PASSWORD
router.post("/auth/forgotPassword", forgotPassword);

// RESET PASSWORD
router.patch("/auth/resetPassword/:token", resetPassword);

// UPDATE PASSWORD
router.patch("/auth/updatepassword", protect , updatePassword);

// UPDATE USER DETAILS
router.patch("/auth/updateprofile", protect, uploadUserPhoto, updateUserProfile);

// DELETE ME ROUTE
router.delete("/auth/deleteMe", protect, deleteMe);

// GET A USER BY ID
router.get("/:id", protect, getUserById);

// EDIT A USER BY ID
router.patch("/:id", protect, restrictions("admin"), editUser);

// DELETE A USER BY ID
router.delete("/:id",protect, restrictions("admin"), deleteUser);

module.exports = router;
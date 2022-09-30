const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, getUserById, editUser, deleteUser } = require("../controllers/userControllers");



module.exports = router;
const User = require("./../model/userModel");
const AppError = require("./../utils/appError")
const jwt = require("jsonwebtoken");

// USERS CONTROLLER FUNCTIONS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            status: "success",
            message: users
        });
    }catch(err){
        next(err);
    }
}

const getUserById = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}
const createUser = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}

const editUser = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}

const deleteUser = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}

const authentication = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        const token = await jwt.sign({id: user._id}, "secret", {expiresIn: "3d"})

        res.status(201).json({
            status: "Success",
            token,
            data: user
})
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser,
    authentication
}





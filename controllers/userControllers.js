const User = require("./../model/userModel");
const AppError = require("./../utils/appError")

// USERS CONTROLLER FUNCTIONS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            status: "success",
            message: users
        });
    }catch(err){
        next(new AppError("Could not find users successfully", 404));
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



module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    editUser,
    deleteUser
}





const User = require("./../model/userModel")
const AppError = require("./../utils/appError")
const asyncHandler = require("./../utils/asyncHandler")

// USERS CONTROLLER FUNCTIONS
const getAllUsers = asyncHandler(async (req, res) => {
        const users = await User.find({});
        res.status(200).send({
            status: "success",
            message: users
        });
})

// GET A USER BY ID
const getUserById = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}

// CREATE A USER => ADMIN AND LEAD
const createUser = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}

// EDIT USER PRIVILEGE
const editUser = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}

// DELETE A USER
const deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
       const user = await User.findByIdAndDelete(id);
       
       if(!user) return next(new AppError("This user ID does not exist", 404));
        res.status(204).json({
            status: "Success",
            message: null
        })
})

const updateUserProfile = asyncHandler(async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true });
    
        res.status(200).json({
            status: "success",
            message: user
        })
})

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    editUser,
    updateUserProfile,
    deleteUser
}





const User = require("./../model/userModel")
const AppError = require("./../utils/appError")
const asyncHandler = require("./../utils/asyncHandler")

// COULD BE USED TO FILTER OBJ IN UPDATEPROFILE
// const filterObj = (obj, ...filter) => {
//     const newObj = {}
//     Object.keys(obj).forEach(el => {
//         if(filter.includes(el)) newObj[el] = obj[el]
//     })
//     return newObj;
// }

// USERS CONTROLLER FUNCTIONS
const getAllUsers = asyncHandler(async (req, res) => {
        const users = await User.find({});
        res.status(200).send({
            status: "success",
            message: users
        });
})

// GET A USER BY ID
const getUserById = asyncHandler(async  (req, res) => {
    const id = req.params.id

    const users = await User.findById(id);
        res.status(200).send({
            status: "success",
            message: users
        });
})

// CREATE A USER => ADMIN
const createUser = asyncHandler(async (req, res) => {
    const user = await User.create(req.body); // CREATE USER
    res.status(500).send({
        status: "Failed",
        message: user
    });
})

// EDIT USER: ADMIN PRIVILEGE
const editUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const body = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(id, body)
    res.status(500).send({
        status: "Success",
        result: user
    });
})

// DELETE A USER: ADMIN PRIVILEGE
const deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
       
    if(!user) return next(new AppError("This user ID does not exist", 404));
    res.status(204).json({
        status: "Success",
        message: null
    })
})

// CHECK PROFILE
const checkProfile = asyncHandler(async (req, res, next) => {
    const profile = await User.findById(req.user.id).select("-__v")
    res.status(200).json({
        status: "Success",
        result: profile
    })
})

// UDPATE USER PROFILE 
const updateUserProfile = asyncHandler(async (req, res, next) => {
    if(req.body.password || req.body.confirmPassword) return next(new AppError("You cant update your password here", 400))
    if(req.body._id) return next(new AppError("Invalid ID input", 400))
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true });
    
        res.status(200).json({
            status: "Success",
            message: user
        })
})

// USER DELETE SELF
const deleteMe = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user);
    user.active = false;
    user.save({ validateBeforeSave: false})
    res.status(200).json({
        status: "Success",
        message: "User has been deactivated... more info will be sent to your gmail",
        source: user
    })
})

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    editUser,
    checkProfile,
    updateUserProfile,
    deleteUser,
    deleteMe
}





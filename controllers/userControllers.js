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

// EDIT USER: ADMIN PRIVILEGE
const editUser = (req, res) => {
    res.status(500).send({
        status: "Failed",
        message: "USER haven't been created yet... check back"
    });
}

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
    console.log(profile)
    res.status(200).json({
        status: "Success",
        result: profile
    })
})

// UDPATE USER PROFILE 
const updateUserProfile = asyncHandler(async (req, res, next) => {
    if(req.body.password || req.body.confirmPassword) return next(new AppError("You cant update your password here", 400))
    if(req.body._id) return next(new AppError("Invalid ID input", 400))
    console.log(req.body, req.user)
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true });
    
        res.status(200).json({
            status: "success",
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
        message: "Processing deletion",
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





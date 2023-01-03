const AppError = require("../utils/appError")
const Tour = require("./../model/tourModel")

const overview = async (req, res) => {
    const tours = await Tour.find()
    const data = {
        title: "Tours overview",
        tours
    }

    res.status(200).render("overview", data)
}

const tour = async (req, res, next) => {
    const slug = req.params.slug
    const tour = await Tour.findOne({ slug: slug})
    .populate({
        path: "guides",
        select: "+name +email +photo"
    })
    .populate({
        path: "reviews"
    })
    if(!tour) return next(new AppError("Tour not found", 404))

    res.status(200).render("tour", { title: tour.name, tour})
}

const loginUser = async (req, res, next) => {
    res.status(200).render("login", { title: "Login"})
}

const profile = async (req, res, next) => {
    res.status(200).render("account", { title: "Login"})
}

module.exports = {
    overview,
    tour,
    loginUser,
    profile
}

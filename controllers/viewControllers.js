const AppError = require("../utils/appError")
const Tour = require("./../model/tourModel")

const overview = async (req, res) => {
    const tours = await Tour.find()
    console.log(tours)
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
    console.log(slug)
    console.log(tour)
    if(!tour) return res.status(404).render("tour", { title: "Not Found"})

    res.status(200).render("tour", { title: tour.name, tour})
}

module.exports = {
    overview,
    tour
}
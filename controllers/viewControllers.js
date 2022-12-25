const Tours = require("./../model/tourModel")

const overview = async (req, res) => {
    const tours = await Tours.find()
    console.log(tours)
    const data = {
        title: "Tours overview",
        tours
    }

    res.status(200).render("overview", data)
}

const tour = (req, res) => {
    res.status(200).render("tour", { title: "Forest Hiker"})
}

module.exports = {
    overview,
    tour
}
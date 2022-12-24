const overview = (req, res) => {
    res.status(200).render("overview", { title: "All Tours"})
}

const tour = (req, res) => {
    res.status(200).render("tour", { title: "Forest Hiker"})
}

module.exports = {
    overview,
    tour
}
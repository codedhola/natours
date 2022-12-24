const router = require("express").Router()

router.get("/", (req, res) => {
    res.status(200).render("base", { 
        tour: "The park camper",
        user: "Coded hola"
    })
})

router.get("/overview", (req, res) => {
    res.status(200).render("overview", { title: "All Tours"})
})

router.get("/tour", (req, res) => {
    res.status(200).render("tour", { title: "Forest Hiker"})
})


module.exports = router
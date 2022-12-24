const router = require("express").Router()
const { overview, tour} = require("./../controllers/viewControllers")

router.get("/", (req, res) => {
    res.status(200).render("base", { 
        tour: "The park camper",
        user: "Coded hola"
    })
})

router.get("/overview", overview)

router.get("/tour", tour)


module.exports = router
const router = require("express").Router()
const { overview, tour, loginUser} = require("./../controllers/viewControllers")
const { isLoggedIn } = require("./../controllers/authController")

router.use(isLoggedIn)
// router.get("/", (req, res) => {
//     res.status(200).render("base", { 
//         tour: "The park camper",
//         user: "Coded hola"
//     })
// })

router.get("/", overview)

router.get("/tour", tour)

router.get("/tours/:slug", tour)

router.get("/login", loginUser)


module.exports = router
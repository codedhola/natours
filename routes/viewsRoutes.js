const router = require("express").Router()
const { overview, tour, loginUser, profile, updateProfile} = require("./../controllers/viewControllers")
const { isLoggedIn, protect } = require("./../controllers/authController")

// router.use()
// router.get("/", (req, res) => {
//     res.status(200).render("base", { 
//         tour: "The park camper",
//         user: "Coded hola"
//     })
// })

router.get("/", isLoggedIn, overview)

router.get("/tour", isLoggedIn, tour)

router.get("/tours/:slug", protect, tour)

router.get("/login", isLoggedIn, loginUser)

router.get("/profile", protect, profile)

router.post("/updateProfile", protect, updateProfile)


module.exports = router
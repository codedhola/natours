const multer = require("multer")
const AppError = require("./appError")

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/users")
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1]
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image")){
        cb(null, true)
    }else{
        cb(new AppError("Not a valid image file", 400))
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})


const uploadUserPhoto = upload.single("photo")

module.exports = {
    uploadUserPhoto
}
const multer = require("multer")
const AppError = require("./appError")
const sharp = require("sharp")

// USING DISK STORAGE => 
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/img/users")
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1]
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })
const multerStorage = multer.memoryStorage()


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

const resizeUserPhoto = async (req, res, next) => {
    if(!req.file) return next()
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    console.log(req.file.filename)
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`)

    next()
}

const uploadTourPhoto = upload.fields([
    { name: "imageCover", maxCount: 1},
    { name: "images", maxCount: 3}
])

const resizeTourPhoto = async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
}

module.exports = {
    uploadUserPhoto,
    resizeUserPhoto,
    uploadTourPhoto,
    resizeTourPhoto
}
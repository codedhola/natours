const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Tour name must exist"]
        
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    }, 
    ratingsQuantity: Number,
    price: {
        type: Number,
        required: [true, "Price must have a Tag"]
    },
    duration: {
        type: Number,
        default: 5
    },
    difficulty: {
        type: String,
        required: [true, "Tour must have a difficulty"]
    },
    summary: {
        type: String,
        required: [true, "Tour requires a summary"]
    },
    imageCover: String,
    images: [String],
    startDates: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    }

});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
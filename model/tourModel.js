const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Tour name must exist"]
        
    },
    rating: {
        type: Number,
        default: 4.5
    }, 
    price: {
        type: Number,
        required: [true, "Price must have a Tag"]
    }
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
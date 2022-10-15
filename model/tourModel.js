const mongoose = require("mongoose");
const slugify = require("slugify");

// CREATE A TOUR SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Tour name must exist"]
        
    },
    slug: String,
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
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
}
);

// VIRTUAL DOCUMENT 
tourSchema.virtual("durationsWeeks").get(function() {
    return this.duration / 7;
})

// DOCUMENT MIDDLEWARE
tourSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true})
    next();
})

// tourSchema.post("save", function(doc, next) {
        
//     next();
// })

// ASSIGN SCHEMA TO MODEL
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
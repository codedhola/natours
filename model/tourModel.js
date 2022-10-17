const mongoose = require("mongoose");
const slugify = require("slugify");

// CREATE A TOUR SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Tour name must exist"],
        minLength: [10, "Name must have more than 10 character"],
        maxLength: [40, "Name must not exceed 40 characters"]
    },
    slug: String,
    ratingsAverage: {
        type: Number,
        default: 3.5,
        min: [1, "Lowest Rating exceeded"],
        max: [5, "Highest Rating exceeded"]
    }, 
    ratingsQuantity: Number,
    price: {
        type: Number,
        required: [true, "Price must have a Tag"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
            return val < this.price
        },
            message: "Discount price is more than expected price"
    }
    },
    duration: {
        type: Number,
        default: 5
    },
    difficulty: {
        type: String,
        required: [true, "Tour must have a difficulty"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Invalid difficulty selected"
        }
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
    },
    secreteTour: {
        type: Boolean,
        default: false
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

// QUERY MIDDLEWARES
tourSchema.pre(/^find/, function(next) {
    this.find({ secreteTour: { $ne: true}})
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function(next){
    this.pipeline().unshift({ $match: {secreteTour: { $ne: true } } })
    next();
});

// ASSIGN SCHEMA TO MODEL
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Please write a review"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Please add a Rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a User"]
    }
},
{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
}
)

reviewSchema.pre(/^find/, function(next){
    // this.find().select("-tour -user")
    next()
})

// reviewSchema.pre(/^find/, function(next) {
//     this.populate("user")
//     next();
// });


const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
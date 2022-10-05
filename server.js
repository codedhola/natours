require("dotenv").config({path: "./config.env"});
const app = require("./app");
const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECT_MONGOOSE).then(() => {
    console.log("connected successfully...");
})

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
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

const testTour = new Tour({
    name: "Developer mind",
    rating: 4.2,
    price: 10
});

testTour.save().then(doc => {
    console.log(doc)
}).catch(err => {
    console.log(err);
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server instance successful... on port " + port);
})

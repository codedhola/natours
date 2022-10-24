const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 10,
        maxlength: 25,
        required: [true, "User must specify a name"]
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(val){
                return val.match()
            },
            message: "Email must be a valid email"
        },
        unique: true
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }
    
})

const User = mongoose.model("User", userSchema);

module.exports = User;
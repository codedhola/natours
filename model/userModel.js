const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
                return val.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/i);
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
        required: true,
        minlength: 10,
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(val){
                return this.password === val;
            },
            message: "Password must Match"
        }
    },
    changePasswordAt: Date
});

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 10);

    this.confirmPassword = undefined;
    next();
})

userSchema.methods.validateUser = async function(userPass, dbPass){
    return bcrypt.compare(userPass, dbPass);
}

userSchema.methods.checkPass = async function(jwtTimeStamp){
    if(this.changePasswordAt){
        const changeStamp = parseInt(this.changePasswordAt.getTime() / 1000);

        return changeStamp > jwtTimeStamp
    }
    return false
}

const User = mongoose.model("User", userSchema);

module.exports = User;
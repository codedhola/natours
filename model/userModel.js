const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
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
        type: String,
        default: "default.jpg"
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(val){
                return this.password === val;
            },
            message: "Password doesn't Match confirm password"
        }
    },
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
    changePasswordAt: Date,
    passwordResetToken: String,
    passwordResetTimer: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

// HASH PASSWORD BEFORE SAVING TO DATABASE
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined; // CANCEL FROM STORING IN DATABASE
    next();
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password") || this.isNew) return next();
    this.changePasswordAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, async function(next){
    this.find({ active: { $ne: false}})
    next();
})

// USER METHOD TO VALIDATE USERS PASSWORD WHEN LOGGING IN
userSchema.methods.validateUser = async function(userPass, dbPass){
    return bcrypt.compare(userPass, dbPass);
}

// USER METHOD TO CHECK IF PASSWORD HAS BEEN CHANGED
userSchema.methods.checkPass = async function(jwtTimeStamp){
    if(this.changePasswordAt){
        const changeStamp = parseInt(this.changePasswordAt.getTime() / 1000);
        return changeStamp > jwtTimeStamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetTimer = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
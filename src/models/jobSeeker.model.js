import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const jobSeekerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_no: {
        type: Number,
        required: true,
        maxLength: 10,
        minLength: 10
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: true
    },
    resume: {
        type: String,  // cloudinary_URL
        required: true
    },
    education: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 16
    },
    skills: {
        type: String
    }
})

jobSeekerSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    } else {
        next()
    }
})

jobSeekerSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

jobSeekerSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,   // Payload --- data
            email: this.email,
            phone_no: this.phone_no
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema)

export default JobSeeker
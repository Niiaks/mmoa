import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        min: 3
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    phone: {
        type: String,
        min: 10,
        trim: true,
        required: true,
    },
    momoNumber: {
        type: String,
        min: 10,
        trim: true
    }
}, { timestamps: true })


export const User = mongoose.model("User", userSchema)
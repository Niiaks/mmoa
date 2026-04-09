import mongoose from "mongoose"
import { ENV } from "./env.js"


export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.dbUrl)
        console.log("db connected")
    } catch (error) {
        console.log("error connecting to db", error)
        process.exit(1)
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log("db disconnected")
    } catch (error) {
        console.log("error disconnecting db")
        process.exit(1)
    }
}
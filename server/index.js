import "dotenv/config"
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
const app = express()
const port = process.env.PORT || 8080


app.use(express.json())


const server = app.listen(port, () => {
    connectDB()
    console.log(`server is running on http://localhost:${port}`)
})

const shutdown = () => {
    console.log("interrupt received")

    server.close(() => {
        //close connections
        disconnectDB()
        console.log("server closed")
    })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
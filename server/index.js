import express from "express";

const app = express()
const port = process.env.PORT || 8080


app.use(express.json())


const server = app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})

const shutdown = () => {
    console.log("interrupt received")

    server.close(() => {
        //close connections
        console.log("server closed")
    })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
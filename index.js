const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const deviceRoute = require("./routes/devices")
const tempRoute = require("./routes/temperatures")

dotenv.config()
app.use(express.json())

const APP_PORT = process.env.APP_PORT
const MONGO_URL = process.env.MONGO_URL

mongoose
	.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log("Connected to MongoDB Server"))
	.catch((err) => console.log(err))

app.use("/auth", authRoute)
app.use("/users", userRoute)
app.use("/devices", deviceRoute)
app.use("/temperatures", tempRoute)

app.listen(APP_PORT, () => {
	console.log(`Backend Server running at port ${APP_PORT}`)
})

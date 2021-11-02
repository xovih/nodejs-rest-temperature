const router = require("express").Router()
const Temperature = require("../models/Temperature")
const verify = require("../middlewares/verifyToken")

// Get Last Five Minus Temperatures
router.get("/", async (req, res) => {
  try {
    const temph = await Temperature.find().sort({ _id: -1 }).limit(15)
    return res.status(200).json({
      error: false,
      data: temph
    })
  } catch (err) {
    return res.status(500).json(
      {
        error: true,
        message: "Server Error !"
      }
    )
  }
})


// Adding Temperature
router.post("/", async (req, res) => {
  try {
    const newTemp = new Temperature(req.query)

    await newTemp.save()

    return res.status(200).json({
      error: false,
      message: "Success insert data !"
    })
  } catch (err) {
    return res.status(500).json(
      {
        error: true,
        message: "Server Error !"
      }
    )
  }
})


module.exports = router
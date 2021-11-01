const router = require("express").Router()
const Temperature = require("../models/Temperature")
const verify = require("../middlewares/verifyToken")

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


module.exports = router
const router = require("express").Router()
const Device = require("../models/Device")
const verify = require("../middlewares/verifyToken")

// ADD Arduino Device
router.post('/', verify, async (req, res) => {
  try {
    const { name, location } = req.body
    const newDevice = new Device({
      name, location,
    })

    const device = await newDevice.save()

    return res.status(201).json({
      error: false,
      message: "Successfully adding New Device !",
      data: device
    })
  } catch (err) {
    return res.status(500).json(err)
  }
})

// UPDATE Arduino Device
router.put('/:id', verify, async (req, res) => {
  try {
    const { id } = req.params
    const update = new Device({
      $set
    })

    const device = await newDevice.save()

    return res.status(201).json({
      error: false,
      message: "Successfully adding New Device !",
      data: device
    })
  } catch (err) {
    return res.status(500).json(err)
  }
})


module.exports = router
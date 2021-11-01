const mongoose = require("mongoose")

const DeviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
    },
    location: {
      type: String,
      required: true,
      minLength: 1,
    }
  }
)

module.exports = mongoose.model("Device", DeviceSchema)
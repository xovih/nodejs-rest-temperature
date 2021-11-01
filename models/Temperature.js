const mongoose = require("mongoose")

const TemperatureSchema = new mongoose.Schema(
  {
    temperature: {
      type: Double,
      required: true,
    },
    humidity: {
      type: Double,
      required: true,
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Temperature", TemperatureSchema)
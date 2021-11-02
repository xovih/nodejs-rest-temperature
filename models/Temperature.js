const mongoose = require("mongoose")
require("mongoose-double")(mongoose)

const SchemaTypes = mongoose.Schema.Types;

const TemperatureSchema = new mongoose.Schema(
  {
    temperature: {
      type: SchemaTypes.Double,
      required: true,
    },
    humidity: {
      type: SchemaTypes.Double,
      required: true,
    },
    device: {
      type: SchemaTypes.ObjectId,
      ref: 'Device',
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Temperature", TemperatureSchema)
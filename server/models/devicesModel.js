const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
  device_id: {
    type: String,
    require: true,
    unique: true,
  },
});

const Devices = mongoose.model("Devices", deviceSchema);

module.exports = Devices;

const mongoose = require("mongoose");

const connectionsSchema = mongoose.Schema({
  device_id: {
    type: String,
    require: true,
    unique: true,
  },

  connections: [
    {
      device_id: {
        type: String,
        require: true,
        unique: true,
      },
    },
  ],
});

const Connections = mongoose.model("Devices", connectionsSchema);

module.exports = Connections;

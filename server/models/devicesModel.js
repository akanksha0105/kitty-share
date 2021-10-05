const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
	deviceId: {
		type: String,
		require: true,
		unique: true,
	},
});

const Devices = mongoose.model("Devices", deviceSchema);

module.exports = Devices;

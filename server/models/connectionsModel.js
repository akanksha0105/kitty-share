const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
	deviceId: {
		type: String,
		require: true,
		unique: true,
	},
	connections: [
		{
			deviceId: {
				type: String,
				require: true,
			},
		},
	],
});

const Connections = mongoose.model("Connections", deviceSchema);

module.exports = Connections;

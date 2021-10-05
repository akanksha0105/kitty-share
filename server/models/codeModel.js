const mongoose = require("mongoose");

const codeSchema = mongoose.Schema({
	deviceId: {
		type: String,
		require: true,
	},
	code: {
		type: String,
		require: true,
	},
	message: {
		type: String,
		require: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Codes = mongoose.model("Codes", codeSchema);

module.exports = Codes;

const mongoose = require("mongoose");

const textCodeSchema = mongoose.Schema({
	code: {
		type: String,
		require: true,
		unique: true,
	},
	message: {
		type: String,
		require: true,
		unique: true,
	},
});

const TextCode = mongoose.model("TextCode", textCodeSchema);

module.exports = TextCode;

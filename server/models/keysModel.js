const mongoose = require("mongoose");

const keysSchema = mongoose.Schema({
	code: {
		type: String,

		unique: true,
	},

	status: {
		type: String,
		require: true,
		default: "unused",
	},
});

const Keys = mongoose.model("Keys", keysSchema);

module.exports = Keys;

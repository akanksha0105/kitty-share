// const e = require("cors");
// const { response } = require("express");
const mongoose = require("mongoose");
// const generateCodes = require("./generateCodes");
var mongoDBURL = process.env.MONGO_URL;

mongoose.connect(mongoDBURL, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

var dbconnect = mongoose.connection;

dbconnect.on("error", () => {
	console.log("MongoDB Connection failed");
});

dbconnect.on("connected", () => {
	console.log("MongoDB Connected");

	// setInterval(checkAndGenerateCodes, 10000);
	// generateCodes.getUnusedCode();
});

module.exports = mongoose;

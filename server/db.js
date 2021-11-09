// const e = require("cors");
const { response } = require("express");
const mongoose = require("mongoose");
const generateCodes = require("./generateCodes");
var mongoDBURL =
	"mongodb+srv://akanksha:akanksha@cluster0.xknwn.mongodb.net/share-url";

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

const checkAndGenerateCodes = () => {
	console.log("In checkAndGenerateCodes function");
	const collection = dbconnect.collection("keys");

	collection.countDocuments({ status: "unused" }, function (err, num) {
		if (err) {
			console.error(err);
		} else {
			if (num >= 3) {
				console.log("Minimal number of codes exist", num);
				return;
			}
			console.log(" less than 1000 codes exist");

			generateCodes.generateCodeCombinations();

			return;
		}
	});
};

module.exports = mongoose;

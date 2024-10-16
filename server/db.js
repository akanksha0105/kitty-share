// const e = require("cors");
// const { response } = require("express");
const mongoose = require("mongoose");
// const generateCodes = require("./generateCodes");
var mongoDBURL =
	process.env.MONGO_URI || "mongodb+srv://admin:dKBVupaayQqk30BZ@cluster0.1iec7.mongodb.net/";

	console.log("HERE IS THE MONGO URL ", mongoDBURL )
	mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error: ", err));

var dbconnect = mongoose.connection;

dbconnect.on("error", () => {
	console.log("MongoDB Connection failed");
});

dbconnect.on("connected", () => {
	console.log("MongoDB Connected");
});



module.exports = mongoose;

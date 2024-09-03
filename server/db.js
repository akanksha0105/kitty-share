require('dotenv').config();

const mongoose = require("mongoose");


var mongoDBURL = process.env.MONGO_URI || "";



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
});


module.exports = mongoose;

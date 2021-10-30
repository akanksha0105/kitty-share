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

// dbconnect.on("connected", () => {
// 	console.log("MongoDB Connected");

// 	const collection = dbconnect.collection("keys");

// 	collection.countDocuments({}, function (err, count) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			if (count > 0) {
// 				console.log("keys exists");
// 				console.log("Count :", count);
// 			} else {
// 				let outputArrayResult = generateCodes.generateCodeCombinations();

// 				for (let i = 0; i < outputArrayResult.length; i++) {
// 					console.log(outputArrayResult[i]);
// 					collection
// 						.insertOne({
// 							code: outputArrayResult[i],
// 							status: "unused",
// 						})
// 						.catch((err) => {
// 							console.error("error in generating codes", err);
// 						});
// 				}
// 			}
// 		}
// 	});
// });

module.exports = mongoose;

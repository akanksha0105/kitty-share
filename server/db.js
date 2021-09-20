const mongoose = require("mongoose");
const Codes = require("./models/codeModel");

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
});

// dbconnect
//   .collection("Codes")
//   .createIndex(
//     { createdAt: 1 },
//     { expireAfterSeconds: 30 },
//     (err, dbResult) => {
//       if (err) throw err;
//       console.log(dbResult);
//       console.log("Index Created");
//       //db.close();
//     }
//   );

module.exports = mongoose;

const mongoose = require("mongoose");

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

module.exports = mongoose;

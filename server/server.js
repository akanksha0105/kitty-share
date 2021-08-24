const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbconnection = require("./db");
const path = require("path");
const cors = require("cors");
const PORT = 5000;

var codeRoute = require("./routes/codeRoute");

app.use(cors());
app.use(bodyParser.json());
app.use("/api/code", codeRoute);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

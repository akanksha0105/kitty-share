const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbconnection = require("./db");
const path = require("path");
const cors = require("cors");
const PORT = 8080;

const server = require("http").Server(app);
const morgan = require("morgan");
app.use(morgan("tiny"));

var codeRoute = require("./routes/codeRoute");

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/code", codeRoute);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

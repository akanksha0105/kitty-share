const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbconnection = require("./db");
const path = require("path");
const cors = require("cors");
const webpush = require("web-push");

// const webpush = require("web-push");
const PORT = 8080;

const server = require("http").Server(app);
const morgan = require("morgan");
app.use(morgan("tiny"));

var codeRoute = require("./routes/codeRoute");
var devicesRoute = require("./routes/devicesRoute");
var subscriptionsRoute = require("./routes/subscriptionsRoute");
var connectionsRoute = require("./routes/connectionsRoute");
// const vapidKeys = webpush.generateVAPIDKeys();
const vapidKeys = {
	publicKey:
		"BHMKkSsulVHdqMkkdLM3wkbxA2_c7JV5oQ5f8WAiUHTrp_XrNgjQC5dA1HHSqrSTTGNOGrj_1V-qZ5lv8QAgrGc",
	privateKey: "MgIq6o5nZTzMnyBVeBIDT2yw_GuFX-WkMz6KaFOEDCM",
};

webpush.setVapidDetails(
	"mailto: mittalakanksha0105@gmail.com",
	vapidKeys.publicKey,
	vapidKeys.privateKey,
);

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client/build")));
//app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/code", codeRoute);
app.use("/api/devices", devicesRoute);
app.use("/api/subscription", subscriptionsRoute);
app.use("/api/connections", connectionsRoute);

app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});

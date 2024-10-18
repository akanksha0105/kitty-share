const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const dbconnection = require("./db");
const path = require("path");
const cors = require("cors");
const webpush = require("web-push");

// const webpush = require("web-push");
const PORT = process.env.PORT || 8080;

const server = require("http").Server(app);
const morgan = require("morgan");
app.use(morgan("tiny"));

var codeRoute = require("./routes/codeRoute");
var devicesRoute = require("./routes/devicesRoute");
var subscriptionsRoute = require("./routes/subscriptionsRoute");
var connectionsRoute = require("./routes/connectionsRoute");
var textRoute = require("./routes/textRoute");
// const vapidKeys = webpush.generateVAPIDKeys();

const vapidKeys = {
	publicKey: process.env.PUBLIC_KEY.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, ""),
	privateKey: process.env.PRIVATE_KEY.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, ""),
};

webpush.setVapidDetails(
	"mailto: mittalakanksha0105@gmail.com",
	vapidKeys.publicKey,
	vapidKeys.privateKey,
);

app.use(bodyParser.json());
app.use(
	cors({
		origin: [process.env.APP_URL],
		methods: ["POST", "GET"],
		credentials: true,
	}),
);

// Routes
app.get("/", (req, res) => {
	res.json({ message: "Server running" });
});

// app.use(cors());
// app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/code", codeRoute);
app.use("/api/devices", devicesRoute);
app.use("/api/subscription", subscriptionsRoute);
app.use("/api/connections", connectionsRoute);
app.use("/api/text", textRoute);

// Global error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
	console.log(`Server running on Port ${PORT}`);
});

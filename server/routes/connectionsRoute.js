const express = require("express");
const router = express.Router();
const ConnectionsModel = require("../models/connectionsModel");
var mongoose = require("mongoose");
const dbconnection = require("../db");
const { db } = require("../models/connectionsModel");

router.get("/:deviceId", (req, res) => {
	console.log("In connectionsRoute.js for getting connections");
	const device_id = req.params.deviceId;
	console.log("connectionsModel retrieve", device_id);
	ConnectionsModel.find({ deviceId: device_id })
		.then((connectionsModelResponse) => {
			console.log("connectionsModelResponse", connectionsModelResponse);

			if (connectionsModelResponse.length <= 0) {
				console.log("No connections found");
				res.status(404).json({ code: 102, message: "No connnections found" });
			}

			let numberOfConnections = connectionsModelResponse[0].connections.length;

			return res
				.status(200)
				.json({ code: 101, message: `${numberOfConnections} Found !!!` });
		})
		.catch((err) => {
			console.error("Problem in connections", err);
			res.status(500).json({
				code: 101,
				message: "Issue encountered in retrieving the connections of device ",
			});
		});
});

router.post("/:deviceId", (req, res) => {
	console.log(
		"********************************************************************************",
	);
	console.log("In connectionsRoute.js for adding connections");
	const currentDeviceId = req.params.deviceId;
	const receiverDeviceID = req.body.receiverDeviceID;

	ConnectionsModel.find({ deviceId: currentDeviceId }).then(
		(connectionsModelResponse) => {
			console.log("connectionsModelResponse", connectionsModelResponse);

			if (connectionsModelResponse.length <= 0) {
				let connectionsArray = [];
				connectionsArray.push({ deviceId: receiverDeviceID });
				console.log("connections Array", connectionsArray);
				const newDeviceConnections = new ConnectionsModel({
					deviceId: currentDeviceId,
					connections: connectionsArray,
				});

				return newDeviceConnections
					.save()
					.then((record) => {
						console.log("new Device's Connections saved in Database");
						console.log(record);
						res.status(200).json({
							data: record,
							message:
								" new Device's Connections saved in Database saved in Database",
						});
					})
					.catch((err) => {
						console.error(
							"Server unable to store the new Device's Connections",
							err,
						);
						res.status(500).json({
							message: "Server unable to store the new Device's Connections",
						});
					});
			} else {
				ConnectionsModel.find({
					connections: { $elemMatch: { deviceId: receiverDeviceID } },
				})

					.then((checking) => {
						// if (checking.length <= 0) {
						// 	return ConnectionsModel.updateOne(
						// 		{
						// 			deviceId: currentDeviceId,
						// 		},
						// 		{
						// 			$addToSet: {
						// 				connections: {
						// 					deviceId: receiverDeviceID,
						// 				},
						// 			},
						// 		},
						// 	);
						// }

						if (checking.length > 0) {
							//What status code needs be here
							return res
								.status(200)
								.json({ data: "Connection already exists in the device list" });
						}
						return ConnectionsModel.updateOne(
							{
								deviceId: currentDeviceId,
							},
							{
								$addToSet: {
									connections: {
										deviceId: receiverDeviceID,
									},
								},
							},
						);
					})

					.then((updatedConnectionRecord) => {
						console.log(
							"Connection model successfully updated",
							updatedConnectionRecord,
						);
						return res
							.status(200)
							.json({ data: "New Connection updated and saved in database" });
					})
					.catch((err) => {
						console.error("error in saving the connection in database", err);
						return res
							.status(500)
							.json({ data: "error in saving the connection in database" });
					});
			}
		},
	);
});

module.exports = router;

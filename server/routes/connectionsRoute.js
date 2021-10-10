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

			//let numberOfConnections = connectionsModelResponse[0].connections.length;
			let connectionsList = connectionsModelResponse[0].connections;
			console.log(connectionsList);

			return res.status(200).json({ code: 101, message: connectionsList });
		})
		.catch((err) => {
			console.error("Problem in connections", err);
			res.status(500).json({
				code: 101,
				message: "Issue encountered in retrieving the connections of device ",
			});
		});
});

const updateConnections = async (currentDeviceId, receiverDeviceID, data) => {
	return ConnectionsModel.find({
		connections: { $elemMatch: { deviceId: receiverDeviceID } },
	}).then((checking) => {
		if (checking.length > 0) {
			//What status code needs be here

			data = "Connection already exists in the device list";
			return data;
		} else {
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
			).then((updatedConnectionRecord) => {
				console.log(
					"Connection model successfully updated",
					updatedConnectionRecord,
				);
				data = "New Connection updated and saved in database";
				return data;
			});
		}
	});
};

const updateOrSaveConnection = async (currentDeviceId, receiverDeviceID) => {
	console.log("In updateOrSaveConnection function");
	let data;
	return ConnectionsModel.find({ deviceId: currentDeviceId })
		.then((connectionsModelResponse) => {
			console.log("connectionsModelResponse", connectionsModelResponse);

			if (connectionsModelResponse.length <= 0) {
				return saveNewConnection(currentDeviceId, receiverDeviceID, data);
			} else {
				return updateConnections(currentDeviceId, receiverDeviceID, data);
			}
		})
		.then((updateOrSaveConnectionResponse) => {
			console.log(
				"updateOrSaveConnectionResponse",
				updateOrSaveConnectionResponse,
			);
			return updateOrSaveConnectionResponse;
		});
};

const saveNewConnection = async (currentDeviceId, receiverDeviceID, data) => {
	let connectionsArray = [];
	connectionsArray.push({ deviceId: receiverDeviceID });
	console.log("connections Array", connectionsArray);
	const newDeviceConnections = new ConnectionsModel({
		deviceId: currentDeviceId,
		connections: connectionsArray,
	});

	return newDeviceConnections.save().then((record) => {
		console.log("new Device's Connections saved in Database", record);
		data = "new Device's Connections saved in Database";
		return data;
	});
};

router.post("/:deviceId", (req, res) => {
	console.log(
		"********************************************************************************",
	);
	console.log("In connectionsRoute.js for adding connections");
	const currentDeviceId = req.params.deviceId;
	const receiverDeviceID = req.body.receiverDeviceID;

	const updateOrSaveConnectionPromise = updateOrSaveConnection(
		currentDeviceId,
		receiverDeviceID,
	);
	updateOrSaveConnectionPromise
		.then((updateOrSaveConnectionPromiseResponse) => {
			console.log(
				"In updateOrSaveConnectionPromiseResponse",
				updateOrSaveConnectionPromiseResponse,
			);
			//console.log(updateOrSaveConnectionPromiseResponse);
			//res.status(200).json({data : u})
		})
		.catch((err) => {
			console.error(
				"error in saving or updating the connection in database",
				err,
			);
			return res
				.status(500)
				.json({
					data: "error in saving or updating the connection in database",
				});
		});
});

// router.post("/:deviceId", (req, res) => {
// 	console.log(
// 		"********************************************************************************",
// 	);
// 	console.log("In connectionsRoute.js for adding connections");
// 	const currentDeviceId = req.params.deviceId;
// 	const receiverDeviceID = req.body.receiverDeviceID;
// 	console.log(currentDeviceId === receiverDeviceID);

// 	ConnectionsModel.find({ deviceId: currentDeviceId }).then(
// 		(connectionsModelResponse) => {
// 			console.log("connectionsModelResponse", connectionsModelResponse);

// 			if (connectionsModelResponse.length <= 0) {
// 				let connectionsArray = [];
// 				connectionsArray.push({ deviceId: receiverDeviceID });
// 				console.log("connections Array", connectionsArray);
// 				const newDeviceConnections = new ConnectionsModel({
// 					deviceId: currentDeviceId,
// 					connections: connectionsArray,
// 				});

// 				return newDeviceConnections
// 					.save()
// 					.then((record) => {
// 						console.log("new Device's Connections saved in Database");
// 						console.log(record);
// 						res.status(200).json({
// 							data: record,
// 							message:
// 								" new Device's Connections saved in Database saved in Database",
// 						});
// 					})
// 					.catch((err) => {
// 						console.error(
// 							"Server unable to store the new Device's Connections",
// 							err,
// 						);
// 						res.status(500).json({
// 							message: "Server unable to store the new Device's Connections",
// 						});
// 					});
// 			} else {
// 				ConnectionsModel.find({
// 					connections: { $elemMatch: { deviceId: receiverDeviceID } },
// 				})

// 					.then((checking) => {
// 						if (checking.length > 0) {
// 							//What status code needs be here
// 							return res.status(200).json({
// 								data: "Connection already exists in the device list",
//								exists : true,
// 							});
// 						}
// 						return ConnectionsModel.updateOne(
// 							{
// 								deviceId: currentDeviceId,
// 							},
// 							{
// 								$addToSet: {
// 									connections: {
// 										deviceId: receiverDeviceID,
// 									},
// 								},
// 							},
// 						);
// 					})

// 					.then((updatedConnectionRecord) => {
// 						console.log(
// 							"Connection model successfully updated",
// 							updatedConnectionRecord,
// 						);
// 						return res
// 							.status(200)
// 							.json({ data: "New Connection updated and saved in database" });
// 					})
// 					.catch((err) => {
// 						console.error("error in saving the connection in database", err);
// 						return res
// 							.status(500)
// 							.json({ data: "error in saving the connection in database" });
// 					});
// 			}
// 		},
// 	);
// });
module.exports = router;

const express = require("express");
const router = express.Router();
const ConnectionsModel = require("../models/connectionsModel");
var mongoose = require("mongoose");
const dbconnection = require("../db");
const { db } = require("../models/connectionsModel");
const getAllConnections = require("../modules/getAllConnections.module");

router.get("/getAllConnections/:deviceId", (req, res) => {
	console.log(
		"In connectionsRoute.js for getting all the deep-down connections",
	);

	const device_id = req.params.deviceId;
	getAllConnections
		.getAllConnections(device_id)
		.then((getAllConnectionsResponse) => {
			console.log("getAllConnectionsResponse :", getAllConnectionsResponse);
			let getAllConnectionsResponseArray = getAllConnectionsResponse;
			// let getAllConnectionsResponseArray = [...getAllConnectionsResponse];

			// [...getAllConnectionsResponse].filter((item) => {
			// 	if (item !== device_id) {
			// 		getAllConnectionsResponseArray.push(item);
			// 	}
			// });
			console.log(
				"getAllConnectionsResponseArray",
				getAllConnectionsResponseArray,
			);

			console.log(
				"getAllConnectionsResponseArrayLength",
				getAllConnectionsResponseArray.length,
			);

			if (getAllConnectionsResponseArray.length <= 0) {
				return res.status(404).json({
					code: 102,
					message: "No Connections",
					connectionsExits: false,
				});
			}

			return res.status(200).json({
				getAllConnectionsArray: getAllConnectionsResponseArray,
				connectionsExists: true,
			});
		})
		.catch((err) => {
			console.error(
				"Error in getting all connections of the current device",
				err,
			);

			return res.status(500).json({
				code: 101,
				message: "Error in getting all connections of the current devi",
				connectionsExits: false,
			});
		});
});

const getConnectionsOfCurrentDevice = async (device_id) => {
	console.log(
		"In getConnectionsOfCurrentDevice function for getting connections",
	);

	return ConnectionsModel.find({ deviceId: device_id })
		.then((connectionsModelResponse) => {
			console.log("connectionsModelResponse", connectionsModelResponse);

			if (connectionsModelResponse.length <= 0) {
				console.log("No connections found");
				return {
					connectionsListExist: false,
					message: "No connections found",
				};
			}

			return {
				connectionsList: connectionsModelResponse[0].connections,
				connectionsListExist: true,
			};
		})
		.catch((err) => {
			console.error("Error in retrieving connections", err);
			return {
				connectionsListExist: false,
				message: "Error in retrieving connections",
			};
		});
};
router.get("/:deviceId", (req, res) => {
	console.log("In connectionsRoute.js for getting connections");
	const device_id = req.params.deviceId;
	console.log("connectionsModel retrieve", device_id);
	ConnectionsModel.find({ deviceId: device_id })
		.then((connectionsModelResponse) => {
			console.log("connectionsModelResponse", connectionsModelResponse);

			if (connectionsModelResponse.length <= 0) {
				console.log("No connections found");
				return res
					.status(404)
					.json({ code: 102, message: "No connnections found" });
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

router.get("/checkifconnected/:deviceId/:receiverdeviceId", (req, res) => {
	console.log("****************** In checkifconnected route ***************");
	const currentDeviceId = req.params.deviceId;
	const receiverDeviceID = req.params.receiverdeviceId;

	console.log("currentDeviceId in Route server side", currentDeviceId);

	console.log("receiverDeviceID in Route server side", receiverDeviceID);

	checkIfConnectionExistsPromise = checkIfConnectionExists(
		currentDeviceId,
		receiverDeviceID,
	);
	checkIfConnectionExistsPromise
		.then((result) => {
			console.log(
				"checkIfConnectionExistsPromise Response on server side",
				result,
			);
			// if (result == true)
			// 	return res
			// 		.status(200)
			// 		.json({ checked: true, connectionexists: result });

			return res.status(200).json({ checked: true, connectionexists: result });
		})
		.catch((err) => {
			console.error(
				"Error in checkIfConnectionExistsPromise Response on server side ",
				err,
			);
			return res.status(500).json({
				checked: false,
				connectionexists: "Unable to check if both the devices are connected",
			});
		});
});

const checkIfConnectionExists = async (currentDeviceId, receiverDeviceID) => {
	console.log(
		" currentDeviceId In checkIfConnectionExists function on server side",
		currentDeviceId,
	);
	console.log(
		"receiverDeviceID In checkIfConnectionExists function on server side",
		receiverDeviceID,
	);
	return ConnectionsModel.find(
		{ deviceId: currentDeviceId },
		{
			connections: { $elemMatch: { deviceId: receiverDeviceID } },
		},
	).then((checking) => {
		console.log("checking", checking);

		if (checking.length > 0 && checking[0].connections.length > 0) {
			//What status code needs be here

			console.log("Connection already exists in the device list");
			return true;
		}
		return false;
	});
};

const updateConnections = async (currentDeviceId, receiverDeviceID, data) => {
	return ConnectionsModel.find(
		{ deviceId: currentDeviceId },
		{
			connections: { $elemMatch: { deviceId: receiverDeviceID } },
		},
	).then((checking) => {
		if (checking[0].connections.length > 0) {
			//What status code needs be here

			let message = "Connection already exists in the device list";
			data = { message: message, connected: false };
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
				let message = "New Connection updated and saved in database";
				data = { message: message, connected: true };
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
		let message = "New connection created";
		data = { message: message, connected: true };
		return data;
	});
};

router.post("/:deviceId", (req, res) => {
	console.log(
		"********************************************************************************",
	);
	console.log("In connectionsRoute.js for adding connections");
	const currentDeviceId = req.params.deviceId;
	const receiverDeviceID = req.body.receivingDeviceId;

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
			res.status(200).json({
				data: updateOrSaveConnectionPromiseResponse.message,
				connected: updateOrSaveConnectionPromiseResponse.connected,
			});
		})
		.catch((err) => {
			console.error(
				"error in saving or updating the connection in database",
				err,
			);
			return res.status(500).json({
				data: "error in saving or updating the connection in database",
				connected: false,
			});
		});
});

router.get("/deleteconnections/:deviceId", (req, res) => {
	console.log("In connectionsRoute.js for deleting connections");
	const currentDeviceId = req.params.deviceId;

	const deleteConnectionsOfCurrentDevicePromise =
		ConnectionsModel.findOneAndDelete({ deviceId: currentDeviceId });

	deleteConnectionsOfCurrentDevicePromise.then(
		(deleteConnectionsOfCurrentDevicePromiseResponse) => {
			console.log(
				"deleteConnectionsOfCurrentDevicePromiseResponse",
				deleteConnectionsOfCurrentDevicePromiseResponse,
			);
		},
	);
});

module.exports = router;

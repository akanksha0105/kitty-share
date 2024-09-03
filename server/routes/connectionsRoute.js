const express = require("express");
const router = express.Router();
const ConnectionsModel = require("../models/connectionsModel");
var mongoose = require("mongoose");
const dbconnection = require("../db");
const { db } = require("../models/connectionsModel");
const getAllConnections = require("../modules/getAllConnections.module");
const RESPONSE_CODES = require("../constants/responseCodes");

//Route Refactored and Checked
router.get("/getAllConnections/:deviceId", (req, res) => {
	console.log("/getAllConnections/:deviceId");
	const deviceId = req.params.deviceId;
	getAllConnections
		.getAllConnections(deviceId)
		.then((getAllConnectionsResponse) => {
			let getAllConnectionsResponseArray = getAllConnectionsResponse;

			if (getAllConnectionsResponseArray.length <= 0) {
				return res.status(404).json({
					data: [],
					code: RESPONSE_CODES.RESOURCE_NOT_FOUND,
					message: "No Connections for the device",
					connectionsExits: false,
				});
			}

			return res.status(200).json({
				data: getAllConnectionsResponseArray,
				code: RESPONSE_CODES.RESOURCE_NOT_FOUND,
				message: "Connections for the given device",
				connectionsExists: true,
			});
		})
		.catch((err) => {
			console.error(
				err
			);

			return res.status(500).json({
				data: [],
				code: RESPONSE_CODES.SERVER_ERROR,
				message: "Error in getting all connections of the current devi",
				connectionsExits: false,
			});
		});
});

//Route Refactored and Checked
const getConnectionsOfCurrentDevice = async (device_id) => {

	return ConnectionsModel.find({ deviceId: device_id })
		.then((connectionsModelResponse) => {

			if (connectionsModelResponse.length <= 0) {
				console.log("No connections found");
				return {
					connectionsList: [],
					code: RESPONSE_CODES.RESOURCE_NOT_FOUND,
					connectionsListExist: false,
					message: "No connections found",
				};
			}

			return {
				connectionsList: connectionsModelResponse[0].connections,
				code: RESPONSE_CODES.SUCCESS,
				connectionsListExist: true,
				message: "connections exist for the device"
			};
		})
		.catch((err) => {
			console.error("Error in retrieving connections", err);
			return {
				connectionsListExist: false,
				connectionsList: [],
				code: RESPONSE_CODES.SERVER_ERROR,
				message: "Error in retrieving connections",
			};
		});
};

//Route Refactored and Checked
router.get("/:deviceId", (req, res) => {

	const device_id = req.params.deviceId;

	ConnectionsModel.find({ deviceId: device_id })
		.then((connectionsModelResponse) => {

			if (connectionsModelResponse.length <= 0) {
				return res
					.status(404)
					.json({ code: RESPONSE_CODES.RESOURCE_NOT_FOUND, message: "No connnections found", data: [] });
			}

			//let numberOfConnections = connectionsModelResponse[0].connections.length;
			let connectionsList = connectionsModelResponse[0].connections;
			console.log(connectionsList);

			return res.status(200).json({ code: RESPONSE_CODES.SUCCESS, message: "Connections retrieved successfully", data: connectionsList });
		})
		.catch((err) => {
			console.error("Problem in connections", err);
			res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				data: [],
				message: "Issue encountered in retrieving the connections of device ",
			});
		});
});

// TODO
router.get("/checkifconnected/:deviceId/:receiverdeviceId", (req, res) => {

	const currentDeviceId = req.params.deviceId;
	const receiverDeviceID = req.params.receiverdeviceId;



	checkIfConnectionExistsPromise = checkIfConnectionExists(
		currentDeviceId,
		receiverDeviceID,
	);
	checkIfConnectionExistsPromise
		.then((result) => {
			//need to add the case for 404
			return res.status(200).json({ code: RESPONSE_CODES.SUCCESS, checked: true, connectionexists: result });
		})
		.catch((err) => {
			console.error(
				"Error in checkIfConnectionExistsPromise Response on server side ",
				err,
			);
			return res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR, checked: true, connectionexists: result
			});
		});
});


//Checked and Refactored
const checkIfConnectionExists = async (currentDeviceId, receiverDeviceID) => {

	return ConnectionsModel.find(
		{ deviceId: currentDeviceId },
		{
			connections: { $elemMatch: { deviceId: receiverDeviceID } },
		},
	).then((response) => {

		if (response && response[0].connections.length > 0) {
			console.log("Connection already exists in the device list");
			return true;
		}
		return false;
	}).catch(error => {
		console.error(error);
		return false;
	});
};

//Checked and Refactored
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

//Checked and Refactored
const updateOrSaveConnection = async (currentDeviceId, receiverDeviceID) => {
	let data;
	return ConnectionsModel.find({ deviceId: currentDeviceId })
		.then((connectionsModelResponse) => {
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

//Checked and Refactored
const saveNewConnection = async (currentDeviceId, receiverDeviceID, data) => {
	let connectionsArray = [];
	connectionsArray.push({ deviceId: receiverDeviceID });
	const newDeviceConnections = new ConnectionsModel({
		deviceId: currentDeviceId,
		connections: connectionsArray,
	});

	return newDeviceConnections.save().then((record) => {
		let message = "New connection created";
		data = { message: message, connected: true };
		return data;
	});
};


//Checked and Refactored
router.post("/:deviceId", (req, res) => {

	const currentDeviceId = req.params.deviceId;
	const receiverDeviceID = req.body.receivingDeviceId;

	const updateOrSaveConnectionPromise = updateOrSaveConnection(
		currentDeviceId,
		receiverDeviceID,
	);
	updateOrSaveConnectionPromise
		.then((updateOrSaveConnectionPromiseResponse) => {

			res.status(200).json({
				code: RESPONSE_CODES.SUCCESS,
				data: updateOrSaveConnectionPromiseResponse.message,
				connected: updateOrSaveConnectionPromiseResponse.connected,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				data: err,
				connected: false,
			});
		});
});
// FIXME: Need to check this
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

const express = require("express");
const router = express.Router();
const DevicesModel = require("../models/devicesModel");
var mongoose = require("mongoose");

//Route checked
router.post("/newdevice", (req, res) => {
	console.log("In route for registering of new device");

	const deviceId = req.body.senderDeviceId;
	//   const deviceName = req.body.deviceName;

	console.log("req.body.senderDeviceId", req.body.senderDeviceId);
	const newDevicePair = new DevicesModel({
		deviceId: deviceId,
		// deviceName: deviceName,
	});

	newDevicePair
		.save()
		.then((record) => {
			console.log("record is", record);
			console.log("record.deviceId", record.deviceId);
			res.status(200).json({ deviceId: record.deviceId });
		})
		.catch((err) => {
			console.error("Problem encountered in saving new device's id", err);
			res
				.status(500)
				.json({ message: "Problem encountered in saving new device's id" });
		});
});

//Route checked
router.post("/deviceidvalid", (req, res) => {
	console.log("In the deviceidvalid route");
	const deviceIdToBeChecked = req.body.deviceIdToBeChecked;
	console.log("device id to be checked", deviceIdToBeChecked);
	DevicesModel.find({ deviceId: deviceIdToBeChecked })
		.exec()
		.then((deviceIdRecord) => {
			console.log("deviceIdRecord", deviceIdRecord);
			if (deviceIdRecord.length <= 0) {
				//No such device_id is present
				return res
					.status(404)
					.json({ code: 102, message: "No such device_id exist" });
			}

			//Later on we will be adding device name in the message

			res.status(200).json({ message: "receiver device exists" });
		})
		.catch((err) => {
			console.error(
				"Server unable to check for device_id in the devices database",
				err,
			);
			res.status(500).json({
				code: 101,
				message: "Server unable to check for device_id in the devices database",
			});
		});
});

// router.post('/getconnections', (req, res) => {
// 	const deviceId = req.body.deviceId;
// 	DevicesModel.find({ deviceId: deviceId })
// 		.exec()
// 		.then((connectionsQueryResults) => {
// 			console.log('Connections record with given device_id', connectionsQueryResults);
// 			if (connectionsRecord.length <= 0) {
// 				return res
// 					.status(404)
// 					.json({ message: 'No existing connections of the given device' });
// 			}

//       res.status(200).json({})
// 		});
// });

module.exports = router;

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
		deviceName: null,
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

router.post("/device/:deviceId", (req, res) => {
	console.log(
		"In route for updating the device's device name with specified current device id",
	);

	const deviceId = req.params.deviceId;
	const deviceName = req.body.generatedDeviceName;
	console.log("deviceName here: ", req.body.generatedDeviceName);

	console.log(`deviceId in post : ${deviceId}`);

	DevicesModel.find({ deviceId: deviceId })
		.then((deviceRecord) => {
			console.log("Device Record : ", deviceRecord);

			let oldDeviceRecord = {
				deviceId: deviceRecord[0].deviceId,
				deviceName: deviceRecord[0].deviceName,
			};

			let newDeviceRecord = {
				deviceId: deviceRecord[0].deviceId,
				deviceName: deviceName,
			};

			return DevicesModel.updateOne(oldDeviceRecord, { $set: newDeviceRecord });
		})
		// DevicesModel.updateOne(
		// 	{ deviceId: deviceId },
		// 	{ $set: { deviceName: deviceName } },
		// )
		.then((updatedDeviceModelRecord) => {
			console.log("updatedDeviceModelRecord", updatedDeviceModelRecord);
			return res.status(200).json({ updatedDeviceName: true });
		})
		.catch((err) => {
			console.error(
				"Error encountered on the server side in updating the device name of the current device: ",
				err,
			);
			return res.status(500).json({ updatedDeviceName: false });
		});
});

router.get("/newdevice/:deviceName", (req, res) => {
	console.log("In route for registering of new device name");

	const deviceName = req.params.deviceName;

	DevicesModel.find({ deviceName: deviceName })
		.then((findDeviceNameResponse) => {
			console.log("findDeviceNameResponse: ", findDeviceNameResponse.length);
			if (findDeviceNameResponse.length > 0)
				return res
					.status(200)
					.json({ deviceNameChecked: true, deviceNameExists: true });

			if (findDeviceNameResponse.length <= 0)
				return res.status(404).json({
					code: 102,
					deviceNameChecked: true,
					deviceNameExists: false,
				});
		})
		.catch((err) => {
			console.error(
				"Error in finding the device with the specified device name",
				err,
			);
			return res
				.status(500)
				.json({ code: 101, deviceNameChecked: false, deviceNameExists: false });
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

router.get("/device/:deviceId", (req, res) => {
	console.log(
		"In route for getting the device's device name with specified current device id",
	);

	const deviceId = req.params.deviceId;

	console.log(`deviceId in get : ${deviceId}`);

	DevicesModel.find({ deviceId: deviceId })
		.then((deviceRecord) => {
			console.log("Device Name : ", deviceRecord[0].deviceName);

			if (deviceRecord.length <= 0) {
				return res.status(404).json({
					code: 102,
					retrievedDeviceName: false,
				});
			}
			return res.status(200).json({
				deviceName: deviceRecord[0].deviceName,
				retrievedDeviceName: true,
			});
		})
		.catch((err) => {
			console.error(
				"Error encountered on the server side in deriving the device name of the current device: ",
				err,
			);
			return res.status(500).json({ code: 101, retrievedDeviceName: false });
		});
});

router.get("/device/:deviceName", (req, res) => {
	console.log("In route for getting the device's device id with deviceName ");

	const deviceName = req.params.deviceName;

	console.log(`deviceName in get : ${deviceName}`);

	DevicesModel.find({ deviceName: deviceName })
		.then((deviceRecord) => {
			if (deviceRecord.length <= 0) {
				return res.status(404).json({
					code: 102,
					retrievedDeviceId: false,
				});
			}

			console.log("Device Id : ", deviceRecord[0].deviceId);
			return res.status(200).json({
				deviceId: deviceRecord[0].deviceId,
				retrievedDeviceId: true,
			});
		})
		.catch((err) => {
			console.error(
				"Error encountered on the server side in deriving the device name of the current device: ",
				err,
			);
			return res.status(500).json({ code: 101, retrievedDeviceId: false });
		});
});

module.exports = router;

const express = require("express");
const router = express.Router();
const DevicesModel = require("../models/devicesModel");
var mongoose = require("mongoose");
const generateDeviceNameModule = require("../modules/generateDeviceName.module");
const RESPONSE_CODES = require("../constants/responseCodes");

//Route checked and refactored
router.post("/newdevice", async (req, res) => {

	const deviceId = req.body.senderDeviceId;

	const newDevicePair = new DevicesModel({
		deviceId: deviceId,
		deviceName: null,
	});

	newDevicePair
		.save()
		.then((record) => {

			res.status(200).json({ code: RESPONSE_CODES.SUCCESS, message: "successfully created new device", deviceId: record.deviceId });
		})
		.catch((err) => {
			console.error("Problem encountered in saving new device's id", err);
			res
				.status(500)
				.json({ code: RESPONSE_CODES.SERVER_ERROR, message: "Problem encountered in saving new device's id", deviceId: "" });
		});
});

//Route checked and refactored
router.post("/newdevice/devicename/:deviceId", (req, res) => {

	const deviceId = req.params.deviceId;

	let deviceName;

	generateDeviceNameModule
		.generateDeviceName(deviceId)
		.then((queryResult) => {

			deviceName = queryResult;

			return DevicesModel.find({ deviceId: deviceId });
		})
		.then((deviceRecord) => {

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

		.then((updatedDeviceModelRecord) => {
			console.log("updatedDeviceModelRecord", updatedDeviceModelRecord);
			return res
				.status(200)
				.json({ code: RESPONSE_CODES.SUCCESS, updatedDeviceName: true, deviceName: deviceName, message: "device name updated" });
		})
		.catch((err) => {
			return res.status(500).json({ code: RESPONSE_CODES.SERVER_ERROR, updatedDeviceName: false, deviceName: "", message: err });
		});
});

//Route checked and refactored
router.get("/newdevice/:deviceName", (req, res) => {

	const deviceName = req.params.deviceName;

	DevicesModel.find({ deviceName: deviceName })
		.then((findDeviceNameResponse) => {
			console.log("findDeviceNameResponse: ", findDeviceNameResponse.length);
			if (findDeviceNameResponse.length > 0)
				return res
					.status(200)
					.json({ code: RESPONSE_CODES.SUCCESS, deviceNameChecked: true, deviceNameExists: true });

			if (findDeviceNameResponse.length <= 0)
				return res.status(404).json({
					code: RESPONSE_CODES.RESOURCE_NOT_FOUND,
					deviceNameChecked: true,
					deviceNameExists: false,
				});
		})
		.catch((err) => {

			return res
				.status(500)
				.json({ code: RESPONSE_CODES.SERVER_ERROR, deviceNameChecked: false, deviceNameExists: false });
		});
});

//Route checked and refactored
router.post("/deviceidvalid", (req, res) => {

	const deviceIdToBeChecked = req.body.deviceIdToBeChecked;

	DevicesModel.find({ deviceId: deviceIdToBeChecked })
		.exec()
		.then((deviceIdRecord) => {
			console.log("deviceIdRecord", deviceIdRecord);
			if (deviceIdRecord.length <= 0) {
				//No such device_id is present
				return res
					.status(404)
					.json({ code: RESPONSE_CODES.RESOURCE_NOT_FOUND, message: "No such device_id exist", deviceidvalid: false });
			}

			//TODO: Later on we will be adding device name in the message

			res.status(200).json({ code: RESPONSE_CODES.SUCCESS, message: "receiver device exists", deviceidvalid: true });
		})
		.catch((err) => {

			res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				message: "Server unable to check for device_id in the devices database",
				deviceidvalid: false,
			});
		});
});

//Route checked and refactored
router.get("/searchdevicename/:deviceId", (req, res) => {

	const deviceId = req.params.deviceId;

	DevicesModel.find({ deviceId: deviceId })
		.then((deviceRecord) => {


			if (deviceRecord.length <= 0) {
				return res.status(404).json({
					code: RESPONSE_CODES.RESOURCE_NOT_FOUND,
					retrievedDeviceName: false,
					deviceName: "",
				});
			}
			return res.status(200).json({
				code: RESPONSE_CODES.SUCCESS,
				deviceName: deviceRecord[0].deviceName,
				retrievedDeviceName: true,
			});
		})
		.catch((err) => {
			console.error(
				"Error encountered on the server side in deriving the device name of the current device: ",
				err,
			);
			return res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				retrievedDeviceName: false,
				deviceName: "",
			});
		});
});

//Route checked and refactored
router.get("/searchdeviceid/:deviceName", (req, res) => {

	const deviceName = req.params.deviceName;

	DevicesModel.find({ deviceName: deviceName })
		.then((deviceRecord) => {
			if (deviceRecord.length <= 0) {
				return res.status(404).json({
					code: RESPONSE_CODES.RESOURCE_NOT_FOUND,
					retrievedDeviceId: false,
					deviceId: "",
				});
			}

			console.log("Device Id : ", deviceRecord[0].deviceId);
			return res.status(200).json({
				code: RESPONSE_CODES.SUCCESS,
				deviceId: deviceRecord[0].deviceId,
				retrievedDeviceId: true,
			});
		})
		.catch((err) => {
			console.error(
				"Error encountered on the server side in deriving the device name of the current device: ",
				err,
			);
			return res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				deviceId: "",
				retrievedDeviceId: false,
			});
		});
});

module.exports = router;

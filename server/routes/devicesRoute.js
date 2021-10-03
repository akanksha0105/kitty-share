const express = require('express');
const router = express.Router();
const DevicesModel = require('../models/devicesModel');
var mongoose = require('mongoose');

router.post('/newdevice', (req, res) => {
	console.log('In route for registering for new device');
	const deviceId = req.body.deviceId;
	//   const deviceName = req.body.deviceName;

	console.log(req.body.deviceId);
	const newDevicePair = new DevicesModel({
		deviceId: deviceId,
		// deviceName: deviceName,
	});

	newDevicePair
		.save()
		.then((record) => {
			console.log('record is', record);
		})
		.catch((err) => {
			console.error("Problem encountered in saving new device's id");
		});
});

router.post('/deviceidvalid', (req, res) => {
	console.log('In the deviceidvalid route');
	const deviceIdToBeChecked = req.body.deviceIdToBeChecked;
	console.log('device id to be checked', deviceIdToBeChecked);
	DevicesModel.find({ device_id: deviceIdToBeChecked })
		.exec()
		.then((deviceIdRecord) => {
			console.log('deviceIdRecord', deviceIdRecord);
			if (deviceIdRecord.length <= 0) {
				//No such device_id is present
				return res.status(404).json({ message: 'No such device_id exist' });
			}

			res.status(200).json({ device_id: deviceIdRecord[0].device_id });
		})
		.catch((err) => {
			console.error(
				'Server unable to check for device_id in the devices database',
				err,
			);
			res.status(500).json({
				message: 'Server unable to check for device_id in the devices database',
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

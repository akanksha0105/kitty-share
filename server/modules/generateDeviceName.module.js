nounsArray = require("../jsonFiles/nouns.json");
adjectivesArray = require("../jsonFiles/adjectives.json");
const DevicesModel = require("../models/devicesModel");

const generateDeviceName = async () => {
	console.log("In generateDeviceName function on the server side");

	let flag = false;

	// console.log(nounsArray[0].nouns.length, adjectivesArray[0].adjectives.length);

	let nounsIndex = Math.floor(Math.random() * nounsArray[0].nouns.length);
	let adjectivesIndex = Math.floor(
		Math.random() * adjectivesArray[0].adjectives.length,
	);
	// console.log("AI : ", adjectivesIndex);
	let generatedDeviceName =
		adjectivesArray[0].adjectives[adjectivesIndex] +
		" " +
		nounsArray[0].nouns[nounsIndex];
	console.log("The generated device name of device is: ", generatedDeviceName);

	return checkIfDeviceNameExists(generatedDeviceName);
	// flag = result;
	// console.log(`Flag here : ${flag}`);
	// if (flag === false) {
	// 	console.log("generatedDeviceName in if loop:", generatedDeviceName);
	// 	flag = true;
	// 	return generatedDeviceName;
	// } else generateDeviceName();
};

const checkIfDeviceNameExists = async (generatedDeviceName) => {
	console.log("In checkIfDeviceNameExists");
	return DevicesModel.findOne({ deviceName: generatedDeviceName })
		.then((record) => {
			console.log(
				"Device name exists record in generateDeviceName.module :",
				record,
			);

			if (record) {
				return generateDeviceName();
			} else return generatedDeviceName;
		})
		.catch((err) => {
			console.error(
				"Error encountered in checking if the device name exists on server side",
				err,
			);

			return generateDeviceName();
		});
};
module.exports = { generateDeviceName };

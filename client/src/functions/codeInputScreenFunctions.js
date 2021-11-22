import axios from "axios";
import { checkDeviceIsSubscribed } from "../functions/functions";

export const getReceiverDeviceName = async (receiverDeviceId) => {
	let deviceId = receiverDeviceId;

	return axios
		.get(`http://localhost:8080/api/devices/device/${deviceId}`)
		.then((getReceiverDeviceNameResponse) => {
			console.log(
				"getReceiverDeviceNameResponse",
				getReceiverDeviceNameResponse,
			);

			return {
				receiverDeviceName: getReceiverDeviceNameResponse.data.deviceName,
				retrievedDeviceName: true,
			};
		})
		.catch((err) => {
			console.error(err);
			const { code } = err.response.data;
			if (code === 101) {
				return {
					message: "Device name not found",
					retrievedDeviceName: false,
				};
			}

			return {
				message: "Internal Error in retrieving Device Name",
				retrievedDeviceName: false,
			};
		});
};
export const checkReceiverDeviceName = async (receiverDeviceName) => {
	const deviceName = receiverDeviceName;
	return axios
		.get(`http://localhost:8080/api/devices/device/${deviceName}`)
		.then((receiverDeviceNameResponse) => {
			console.log("receiverDeviceNameResponse", receiverDeviceNameResponse);
			console.log(
				"eceiverDeviceNameResponse.data.deviceId",
				receiverDeviceNameResponse.data.deviceId,
			);
			return {
				receiverDeviceId: receiverDeviceNameResponse.data.deviceId,
				retrievedDeviceId: true,
			};
		})
		.catch((err) => {
			console.error(err);
			const { code } = err.response.data;
			if (code === 101) {
				return {
					message: "Device name not found",
					retrievedDeviceId: false,
				};
			}

			return {
				message: "Internal Error in retrieving Device Name",
				retrievedDeviceId: false,
			};
		});
};
export const retrieveMessage = async (codeInputValue) => {
	const codedMessage = codeInputValue;

	return axios
		.get(`/api/code/geturl/${codedMessage}`)
		.then((retrievedMessagePromiseResponse) => {
			console.log(
				"retrievedMessagePromiseResponse",
				retrievedMessagePromiseResponse,
			);

			const { data, device } = retrievedMessagePromiseResponse.data;
			let successMessage = {
				data: data,
				device: device,
				messageRetrieved: true,
			};
			return successMessage;
		})
		.catch((err) => {
			const { code, data } = err.response.data;
			if (code === 102) console.error(data);

			console.error(data);
			let errorMessage = { data: data, messageRetrieved: false };

			return errorMessage;
		});
};

export const checkIfDeviceCanBeAddedAsConnection = (
	currentDeviceId,
	device,
) => {
	if (currentDeviceId.localeCompare(device) === 0) return false;

	// check if there is a connection already present between both the devices
	return checkDeviceIsAnExistingConnection(currentDeviceId, device)
		.then((checkDeviceIsAnExistingConnectionResponse) => {
			console.log(
				"checkDeviceIsAnExistingConnectionResponse",
				checkDeviceIsAnExistingConnectionResponse,
			);
			if (checkDeviceIsAnExistingConnectionResponse === true) return false;
			return areBothSenderAndReceiverSubscribed(currentDeviceId, device);
		})
		.then((areBothSenderAndReceiverSubscribedResponse) => {
			console.log(
				"areBothSenderAndReceiverSubscribedResponse",
				areBothSenderAndReceiverSubscribedResponse,
			);
			return areBothSenderAndReceiverSubscribedResponse;
		})
		.catch((err) => {
			console.error(err);
			return false;
		});

	//check if both the sending and the receiving devices are subscribed to notifications
};

const areBothSenderAndReceiverSubscribed = async (currentDeviceId, device) => {
	return checkDeviceIsSubscribed(currentDeviceId)
		.then((checkDeviceIsSubscribedResponse) => {
			console.log(
				"CheckDeviceIsSubscribedResponse - Here it is the sender device",
				checkDeviceIsSubscribedResponse,
			);

			if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
				console.log("The sending device is not subscribed to notifications");
				return false;
			}
			return checkReceiverDeviceIsSubscribed(device);
		})
		.catch((err) => {
			console.error(err);
			return false;
		});
};

const checkReceiverDeviceIsSubscribed = async (device) => {
	return checkDeviceIsSubscribed(device)
		.then((checkDeviceIsSubscribedResponse) => {
			console.log(
				"Receiver device subscription to notifications response",
				checkDeviceIsSubscribedResponse,
			);

			if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
				console.log("The receiving device is not subscribed to notifications");
				return false;
			}
			return true;
		})
		.catch((err) => {
			console.error(err);
		});
};

export const checkDeviceIsAnExistingConnection = async (
	currentDeviceId,
	device,
) => {
	let device_id = currentDeviceId;
	let receiverDeviceID = device;
	console.log(
		"device_id in the checktheConnection function on client side",
		device_id,
	);
	console.log(
		" receiverDeviceIDin the checktheConnection function on client side",
		receiverDeviceID,
	);
	return axios
		.get(
			`http://localhost:8080/api/connections/checkifconnected/${device_id}/${receiverDeviceID}`,
		)

		.then((connectionExistsResponse) => {
			console.log(
				"connectionExistsResponse on client side in checktheConnection function ",
				connectionExistsResponse,
			);
			if (
				connectionExistsResponse.data.checked == true &&
				connectionExistsResponse.data.connectionexists == true
			) {
				return true;
			}

			return false;
		})
		.catch((err) => {
			console.error("Unable to check if both the devices are connected", err);
			return false;
		});
};

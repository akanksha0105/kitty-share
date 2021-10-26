//Functions for linkToDeviceScreen
import axios from "axios";

export const checkReceiverDeviceIsSubscribed = async (receiverDeviceID) => {
	const deviceIdToBeChecked = receiverDeviceID;

	console.log(
		"device that is to be checked if it is subscribed to notifications",
		deviceIdToBeChecked,
	);

	return axios
		.get(
			`http://localhost:8080/api/subscription/subscribeddevice/${deviceIdToBeChecked}`,
		)
		.then((isDeviceSubscribedResponse) => {
			console.log(
				"Checking if entered receiver's device id is subscribed to notifications or not ",
				isDeviceSubscribedResponse,
			);
			const { message } = isDeviceSubscribedResponse.data;
			let successMessage = { message: message, isSubscribed: true };
			return successMessage;
		})
		.catch((err) => {
			const { code } = err.response.data;
			let errMessage;
			if (code === 102) {
				errMessage = "Device not subscribed to notifications";
				console.error("Device not subscribed to notifications");
			} else {
				console.error("Unable to link to a new device");
				errMessage = "Unable to link to a new device";
			}

			let errorMessage = { message: errMessage, isSubscribed: false };
			return errorMessage;
		});
};

export const addReceiverToTheDeviceConnectionList = async (
	currentDeviceId,
	receiverDeviceID,
) => {
	let device_id = currentDeviceId;
	let receivingDeviceId = receiverDeviceID;

	console.log(
		"device_id in the addReceiverToTheDeviceConnectionList",
		device_id,
		"receivingDeviceId  in the addReceiverToTheDeviceConnectionList",
		receivingDeviceId,
	);

	return axios
		.post(`http://localhost:8080/api/connections/${device_id}`, {
			receivingDeviceId,
		})
		.then((addReceiverToListResponse) => {
			console.log("addReceiverToListResponse", addReceiverToListResponse);
			const { data } = addReceiverToListResponse.data;
			let successMessage = data;
			// return successMessage;
			return true;
		})
		.catch((err) => {
			console.error("Unable to add the device to the connection list", err);
			let errorMessage = "Unable to add the device to the connection list";
			// return errorMessage;
			return false;
		});
};

export const addSenderToTheDeviceConnectionList = async (
	currentDeviceId,
	receiverDeviceID,
) => {
	let device_id = receiverDeviceID;
	let receivingDeviceId = currentDeviceId;
	console.log(
		"device_id in the addSenderToTheDeviceConnectionList",
		device_id,
		"receivingDeviceId  in the addSenderToTheDeviceConnectionList",
		receivingDeviceId,
	);

	return axios
		.post(`http://localhost:8080/api/connections/${device_id}`, {
			receivingDeviceId,
		})
		.then((addReceiverToListResponse) => {
			console.log("addReceiverToListResponse", addReceiverToListResponse);
			const { data } = addReceiverToListResponse.data;
			let successMessage = data;
			// return successMessage;
			return true;
		})
		.catch((err) => {
			console.error("Unable to add the device to the connection list", err);
			let errorMessage = "Unable to add the device to the connection list";
			// return errorMessage;
			return false;
		});
};

export const linkSenderToReceiver = async (
	currentDeviceId,
	receiverDeviceID,
) => {
	console.log("In linkSenderToReceiver component on client side");
	return checkReceiverDeviceIsSubscribed(receiverDeviceID)
		.then((checkReceiverDeviceIsSubscribedResponse) => {
			console.log(
				"response in checkReceiverDeviceIsSubscribed",
				checkReceiverDeviceIsSubscribedResponse,
			);
			if (checkReceiverDeviceIsSubscribedResponse.isSubscribed === false) {
				// return checkReceiverDeviceIsSubscribedResponse.message;
				console.log("Receiver Device is not subscribed to notifications");
				return false;
			}

			return addReceiverToTheDeviceConnectionList(
				currentDeviceId,
				receiverDeviceID,
			);
		})
		.then((linkedToADeviceResponse) => {
			console.log("linkedToADeviceResponse", linkedToADeviceResponse);
			// setMessage(linkedToADeviceResponse);
			return true;
		})
		.catch((err) => {
			console.error("Unable to link to a new device", err);
			// setMessage("Unable to link to a new device");
			return false;
		});
};

export const linkReceiverToSender = async (
	currentDeviceId,
	receiverDeviceID,
) => {
	return checkReceiverDeviceIsSubscribed(currentDeviceId)
		.then((checkReceiverDeviceIsSubscribedResponse) => {
			console.log(
				"response in checkReceiverDeviceIsSubscribed",
				checkReceiverDeviceIsSubscribedResponse,
			);
			if (checkReceiverDeviceIsSubscribedResponse.isSubscribed === false) {
				// return checkReceiverDeviceIsSubscribedResponse.message;
				console.log("Sender Device is not subscribed to notifications");
				return false;
			}

			return addSenderToTheDeviceConnectionList(
				currentDeviceId,
				receiverDeviceID,
			);
		})
		.then((linkedToADeviceResponse) => {
			console.log("linkedToADeviceResponse", linkedToADeviceResponse);
			// setMessage(linkedToADeviceResponse);
			return true;
		})
		.catch((err) => {
			console.error("Unable to link to a new device", err);
			// setMessage("Unable to link to a new device");
			return false;
		});
};

export const linkDevices = async (currentDeviceId, receiverDeviceID) => {
	console.log("In linkDevices function on client side");

	//Here sender = currentDeviceId, receiver = receiverDeviceID that we are getting from LinkToDevice Component

	return linkSenderToReceiver(currentDeviceId, receiverDeviceID)
		.then((linkSenderToReceiverResponse) => {
			console.log(linkSenderToReceiverResponse);
			if (linkSenderToReceiverResponse === false) {
				return false;
			}

			return linkReceiverToSender(currentDeviceId, receiverDeviceID);
		})
		.then((linkReceiverToSenderResponse) => {
			if (linkReceiverToSenderResponse === false) return false;

			return true;
		})
		.catch((err) => {
			console.error(err);
			return false;
		});
};

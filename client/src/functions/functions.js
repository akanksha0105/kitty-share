//Functions for linkToDeviceScreen
import axios from "axios";

// export const checkReceiverDeviceIsSubscribed = async (receiverDeviceID) => {
// 	const deviceIdToBeChecked = receiverDeviceID;

export const checkDeviceIsSubscribed = async (deviceIdToBeChecked) => {
	console.log(
		"device that is to be checked if it is subscribed to notifications",
		deviceIdToBeChecked,
	);

	return axios
		.get(
			`http://localhost:8080/api/subscription/subscribeddevice/${deviceIdToBeChecked}`,
		)
		.then((isDeviceSubscribedResponse) => {
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

export const linkDevices = async (currentDeviceId, receiverDeviceID) => {
	console.log("In linkDevices function on client side");

	// Check Sender_Device is subscribed to notifications
	// Check Receiver is Subscribed To Notifications
	// Add Receiver device to the  sender connections list
	// Add Sender device to the receiver device connections list
	return checkDeviceIsSubscribed(currentDeviceId)
		.then((checkDeviceIsSubscribedResponse) => {
			console.log(
				"CheckDeviceIsSubscribedResponse - Here it is the sender device",
				checkDeviceIsSubscribedResponse,
			);

			if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
				let response = {
					message: "The sending device is not subscribed to notifications",
					linked: false,
				};
				return response;
			}

			return canReceiverDeviceBeLinked(currentDeviceId, receiverDeviceID);
		})
		.then((linkDevicesResponse) => {
			console.log("linkDevicesResponse", linkDevicesResponse);
			return linkDevicesResponse;
		})
		.catch((err) => {
			console.error(err);
		});
};

export const canReceiverDeviceBeLinked = async (
	currentDeviceId,
	receiverDeviceID,
) => {
	// Check Receiver is Subscribed To Notifications

	return checkDeviceIsSubscribed(receiverDeviceID)
		.then((checkDeviceIsSubscribedResponse) => {
			console.log(
				"CheckDeviceIsSubscribedResponse - Here it is the receiving device",
				checkDeviceIsSubscribedResponse,
			);

			if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
				let response = {
					message: "The receiving device is not subscribed to notifications",
					linked: false,
				};
				return response;
			}

			return addSenderAndReceiverToTheDeviceConnectionList(
				currentDeviceId,
				receiverDeviceID,
			);
		})

		.catch((err) => {
			console.error(err);
		});
};

export const addSenderAndReceiverToTheDeviceConnectionList = async (
	currentDeviceId,
	receiverDeviceID,
) => {
	return addSenderToTheDeviceConnectionList(
		currentDeviceId,
		receiverDeviceID,
	).then((addSenderToTheDeviceConnectionListResponse) => {
		console.log(
			"addSenderToTheDeviceConnectionListResponse",
			addSenderToTheDeviceConnectionListResponse,
		);
		if (addSenderToTheDeviceConnectionListResponse.connected === false) {
			let response = {
				message: addSenderToTheDeviceConnectionListResponse.data,
				linked: false,
			};
			return response;
			// return addSenderToTheDeviceConnectionListResponse.data;
		}

		return addReceiverToTheDeviceConnectionList(
			currentDeviceId,
			receiverDeviceID,
		);
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
		.then((addSenderToListResponse) => {
			const { data, connected } = addSenderToListResponse.data;
			let successMessage = { data: data, connected: connected };
			return successMessage;
		})
		.catch((err) => {
			console.error("Unable to add the device to the connection list", err);
			let errorMessage = {
				data: "Unable to add the device to the connection list",
				connected: false,
			};
			return errorMessage;
			// return false;
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
			// const { data, connected } = addReceiverToListResponse.data;

			if (addReceiverToListResponse.data.connected === false) {
				let response = {
					message: addReceiverToListResponse.data.data,
					linked: false,
				};
				return response;
			} else {
				let response = {
					message: addReceiverToListResponse.data.data,
					linked: true,
				};
				return response;
			}
		})
		.catch((err) => {
			console.error("Unable to add the device to the connection list", err);
			let errorMessage = {
				data: "Unable to add the device to the connection list",
				linked: false,
			};
			return errorMessage;
			// return false;
		});
};

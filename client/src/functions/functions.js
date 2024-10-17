//Functions for linkToDeviceScreen
import axios from "axios";
import { baseURL } from "../helper";

// export const checkReceiverDeviceIsSubscribed = async (receiverDeviceID) => {
// 	const deviceIdToBeChecked = receiverDeviceID;

export const checkDeviceIsSubscribed = async (deviceIdToBeChecked) => {
	return axios
		.get(`${baseURL}/api/subscription/subscribeddevice/${deviceIdToBeChecked}`)
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
	return checkDeviceIsSubscribed(currentDeviceId)
		.then((checkDeviceIsSubscribedResponse) => {
			if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
				let response = {
					message:
						"You are not subscribed to notifications. Subscribe to send notifications to the connections",
					linked: false,
				};
				return response;
			}

			return canReceiverDeviceBeLinked(currentDeviceId, receiverDeviceID);
		})
		.then((linkDevicesResponse) => {
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
			if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
				let response = {
					message:
						"The receiving device needs to subscribe to notifications to receive messages",
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

	return axios
		.post(`${baseURL}/api/connections/${device_id}`, {
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

	return axios
		.post(`${baseURL}/api/connections/${device_id}`, {
			receivingDeviceId,
		})
		.then((addReceiverToListResponse) => {
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

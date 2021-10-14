//Functions for linkToDeviceScreen
import axios from "axios";

export const checkReceiverDeviceIsSubscribed = async (receiverDeviceID) => {
	const deviceIdToBeChecked = receiverDeviceID;

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
	let device_id = currentDeviceId.currentDeviceId;

	return axios
		.post(`http://localhost:8080/api/connections/${device_id}`, {
			receiverDeviceID,
		})
		.then((addReceiverToListResponse) => {
			console.log("addReceiverToListResponse", addReceiverToListResponse);
			const { data } = addReceiverToListResponse.data;
			let successMessage = data;
			return successMessage;
		})
		.catch((err) => {
			console.error("Unable to add the device to the connection list", err);
			let errorMessage = "Unable to add the device to the connection list";
			return errorMessage;
		});
};
// export const sendNotificationToTheServer = async (
// 	receiverDeviceID,
// 	currentDeviceId,
// 	urlTobeShared,
// ) => {
// 	let receiverDeviceId = receiverDeviceID;
// 	return await axios
// 		.post("http://localhost:8080/api/subscription/sendnotification", {
// 			currentDeviceId,
// 			receiverDeviceId,
// 			urlTobeShared,
// 		})
// 		.then((sendNotificationToTheServerResponse) => {
// 			console.log(
// 				"URL is shared with the receiver",
// 				sendNotificationToTheServerResponse,
// 			);
// 			return true;
// 		})
// 		.catch((err) => {
// 			console.error("Unable to share URL with the receiver");
// 			return false;
// 		});
// };

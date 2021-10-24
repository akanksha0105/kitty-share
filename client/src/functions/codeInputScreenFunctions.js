import axios from "axios";

export const retrieveMessage = async (codeInputValue) => {
	const codedMessage = codeInputValue;

	return axios
		.get(`http://localhost:8080/api/code/geturl/${codedMessage}`)
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

	return checkDeviceIsAnExistingConnection(currentDeviceId, device).then(
		(checkDeviceIsAnExistingConnectionResponse) => {
			if (checkDeviceIsAnExistingConnectionResponse === false) return true;
			return false;
		},
	);
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

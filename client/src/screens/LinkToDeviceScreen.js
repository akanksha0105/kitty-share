import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Message from "../Message";

//import './styles.css';

function LinkToDeviceScreen() {
	const location = useLocation();
	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const [receiverDeviceID, setReceiverDeviceID] = useState("");
	const [messageHeader, setMessageHeader] = useState("");
	const [messageContent, setMessageContent] = useState("");

	//Event handler for sending the URL to the receiver's device
	const onSendingToOtherDevice = () => {
		checkReceiverDeviceIsSubscribed()
			.then((response) => {
				console.log("response in checkReceiverDeviceIsSubscribed", response);

				if (response == false) return;

				return addReceiverToTheDeviceConnectionList();
			})
			.then((addReceiverToTheDeviceConnectionListResponse) => {
				console.log(
					"ddReceiverToTheDeviceConnectionListResponse",
					addReceiverToTheDeviceConnectionListResponse,
				);

				return sendNotificationToTheServer();
			})
			.then((sendMessageToDevice) => {
				console.log(sendMessageToDevice);
				setMessageContent("Hooray!!! URL has been sent to the receiver");
				console.log("Hooray!!! URL has been sent to the receiver");
				//return successOrFailureMessage();
			})
			// .then((response) => {
			// 	console.log("Message successfully logged on screen ", response);
			// })
			.catch((err) => {
				console.error(
					"Error encountered in sending the url to the other device",
					err,
				);
			});
	};

	// const successOrFailureMessage = () => {
	// 	console.log("In successOrFailure function");
	// 	return (
	// 		<Link to="/success">
	// 			<Message
	// 				messageHeader={messageHeader}
	// 				messageContent={messageContent}
	// 			/>
	// 		</Link>
	// 	);
	// };
	const checkReceiverDeviceIsSubscribed = async () => {
		//check whether the entered device_id is valid or not
		// Later discovered process : It is better to check the receiver's device in the subscriptions Model list - because if it is not subscribed to notifications,
		//we are not anyway sending it

		const deviceIdToBeChecked = receiverDeviceID;
		let messageTitle;
		return axios
			.get(
				`http://localhost:8080/api/subscription/subscribeddevice/${deviceIdToBeChecked}`,
			)
			.then((isDeviceSubscribedResponse) => {
				console.log(
					"Checking if entered receiver's device id is subscribed to notifications or not ",
					isDeviceSubscribedResponse,
				);
				messageTitle = isDeviceSubscribedResponse.data.message;
				setMessageHeader(messageTitle);
				return true;
			})
			.catch((err) => {
				const { code } = err.response.data;
				if (code === 102) {
					console.error("Device not subscribed to notifications");
					messageTitle = "Device not subscribed to notifications";
					setMessageHeader(messageTitle);
					return false;
				}

				console.error(
					"Unable to check if device is subscribed to notifications",
				);
			});
	};

	const addReceiverToTheDeviceConnectionList = async () => {
		console.log("addReceiverToTheDeviceConnectionList");
		let device_id = currentDeviceId.currentDeviceId;
		console.log("device_id in addReceiverToTheDeviceConnectionList", device_id);

		return axios
			.post(`http://localhost:8080/api/connections/${device_id}`, {
				receiverDeviceID,
			})
			.then((addReceiverToListResponse) => {
				console.log(addReceiverToListResponse);
				console.log(addReceiverToListResponse.data.data);
				// console.log(
				// 	"Receiver's device successfully addded to the sender's device connection list",
				// );
				return addReceiverToListResponse.data.data;
			})
			.catch((err) => {
				console.error(
					"Issue in saving the device to the connections list",
					err,
				);
			});
	};
	const sendNotificationToTheServer = async () => {
		return await axios
			.post("http://localhost:8080/api/subscription/sendnotification", {
				currentDeviceId,
				receiverDeviceID,
				urlTobeShared,
			})
			.then((sendNotificationToTheServerResponse) => {
				console.log(
					"URL is shared with the receiver : ",
					sendNotificationToTheServerResponse,
				);
			})
			.catch((err) =>
				console.error("Error in sending URL to the user.. ", err),
			);
	};
	return (
		<div className="link__to__a__device__screen">
			<form>
				<div>
					<label>
						<input
							id="receiver_device_id"
							type="text"
							value={receiverDeviceID}
							onChange={(e) => setReceiverDeviceID(e.target.value)}
							required
						/>
						<div className="label-text">Enter the Device Id</div>
					</label>
				</div>

				{receiverDeviceID.length > 0 ? (
					<button type="button" onClick={onSendingToOtherDevice}>
						Send
					</button>
				) : null}

				{messageContent ? (
					<Link to="/success">
						<Message
							messageHeader={messageHeader}
							messageContent={messageContent}
						/>
					</Link>
				) : null}
			</form>

			<div></div>
		</div>
	);
}

export default LinkToDeviceScreen;

// const deviceIdToBeChecked = receiverDeviceID;
// axios
// 	.post("http://localhost:8080/api/devices/deviceidvalid", {
// 		deviceIdToBeChecked,
// 	})
// 	.then((deviceIdValidConfirmation) => {
// 		console.log("Device id valid confirmation", deviceIdValidConfirmation);
// 		console.log(deviceIdValidConfirmation.data.message);
// 		//For valid device_id

// 		//Also add this receiver's device to the sending device connections list
// 		addReceiverToTheDeviceConnectionList();
// 		//send the notification to the receiver's device
// 		sendNotificationToTheServer();
// 	})
// 	.catch((error) => {
// 		console.log("Unexxpected error", error);
// 		const { code } = error.response;
// 		if (code === 102) {
// 			return console.error("No such device with this device_id exists");
// 		}

// 		console.error("Unable to check for device_id in the devices database");
// 	});

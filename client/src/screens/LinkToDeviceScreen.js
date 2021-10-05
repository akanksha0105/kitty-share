import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
//import './styles.css';

function LinkToDeviceScreen() {
	const location = useLocation();
	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const [receiverDeviceID, setReceiverDeviceID] = useState("");

	//Event handler for sending the URL to the receiver's device
	const onSendingToOtherDevice = () => {
		//check whether the entered device_id is valid or not
		// Later discovered process : It is better to check the receiver's device in the subscriptions Model list - because if it is not subscribed to notifications,
		//we are not anyway sending it
		// console.log("Receiver's device id", receiverDeviceID);
		const deviceIdToBeChecked = receiverDeviceID;
		axios
			.get(
				`http://localhost:8080/api/subscription/subscribeddevice/${deviceIdToBeChecked}`,
			)
			.then((isDeviceSubscribedResponse) => {
				console.log(
					"Checking if entered receiver's device id is subscribed to notifications or not ",
					isDeviceSubscribedResponse,
				);
			})
			.catch((err) => {
				console.error(
					"Encountered issue in checking the receiver's id validation for subscription of notifications",
					err,
				);
			});

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
	};

	const addReceiverToTheDeviceConnectionList = () => {
		console.log("addReceiverToTheDeviceConnectionList");
		let device_id = currentDeviceId.currentDeviceId;
		console.log("device_id in addReceiverToTheDeviceConnectionList", device_id);
		axios
			.post(`http://localhost:8080/api/connections/${device_id}`, {
				receiverDeviceID,
			})
			.then((addReceiverToListRespnse) => {
				console.log(addReceiverToListRespnse);
				console.log(
					"Receiver's device successfully addded to the sender's device connection list",
				);
			})
			.catch((err) => {
				console.error("Issue in saving the device to list", err);
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
			</form>
		</div>
	);
}

export default LinkToDeviceScreen;

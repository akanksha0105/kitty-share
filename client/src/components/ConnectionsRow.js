import React, { useState, useEffect } from "react";
import "../styles/ConnectionsRow.css";
import axios from "axios";

const ConnectionsRow = (props) => {
	const {
		receiverDeviceId,
		currentDeviceId,
		urlTobeShared,
		currentDeviceName,
	} = props;

	const [recieverName, setReceiverName] = useState("");
	const [buttonText, setButtonText] = useState("Send");

	// console.log(
	// 	`currentDeviceId is ${currentDeviceId},  receiverDeviceId is ${receiverDeviceId}, urlToBeShared is ${urlTobeShared} and currentDeviceName is ${currentDeviceName}`,
	// );

	const onGetReceiverName = async () => {
		console.log("In onGetReceiverName");
		let deviceId = receiverDeviceId;
		return axios
			.get(`/api/devices/searchdevicename/${deviceId}`)
			.then((onGetReceiverNameResponse) => {
				console.log("onGetReceiverNameResponse", onGetReceiverNameResponse);
				if (onGetReceiverNameResponse.data.retrievedDeviceName === true)
					setReceiverName(onGetReceiverNameResponse.data.deviceName);
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const onSendNotificationToTheServer = (event) => {
		// event.preventDefault();

		console.log(
			"In onSendNotificationToTheServer event handler in ConnectionsRow component ",
		);

		let notificationSendingDevice = currentDeviceName;
		console.log(
			`In onSendNotificationToServer, currentDeviceId is ${currentDeviceId},  receiverDeviceId is ${receiverDeviceId}, urlToBeShared is ${urlTobeShared}, notificationSendingDevice is ${notificationSendingDevice} `,
		);

		axios
			.post("/api/subscription/sendnotification", {
				currentDeviceId,
				receiverDeviceId,
				urlTobeShared,
				notificationSendingDevice,
			})
			.then((sendNotificationToTheServerResponse) => {
				console.log(
					"URL is shared with the receiver : ",
					sendNotificationToTheServerResponse,
				);
				const { message, sent } = sendNotificationToTheServerResponse.data;

				if (sent === true) {
					setButtonText("Sent");
				}

				//Message sent component
			})
			.catch((err) => console.error("Error in sending URL to the user", err));
	};

	useEffect(() => {
		onGetReceiverName();
	}, []);
	return (
		<div className="connections__row">
			{recieverName ? (
				<>
					<div className="left__side">
						<div className="receiver__id">{recieverName}</div>
					</div>
					<div className="right__side">
						<button
							type="button"
							onClick={onSendNotificationToTheServer}
							disabled={buttonText === "Send" ? false : true}>
							{" "}
							{/* Send */}
							{buttonText}
						</button>
					</div>
				</>
			) : null}
			{/* <div className="receiver__id">{receiverDeviceId}</div> */}
		</div>
	);
};

export default ConnectionsRow;

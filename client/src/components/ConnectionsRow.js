import React, { useState, useEffect } from "react";
import "../styles/ConnectionsRow.css";
import axios from "axios";

const ConnectionsRow = (props) => {
	const { receiverDeviceId, currentDeviceId, urlTobeShared } = props;

	const [recieverName, setReceiverName] = useState("");

	console.log(
		`currentDeviceId is ${currentDeviceId},  receiverDeviceId is ${receiverDeviceId}, urlToBeShared is ${urlTobeShared}`,
	);

	const onGetReceiverName = async () => {
		console.log("In onGetReceiverName");
		let deviceId = receiverDeviceId;
		return axios
			.get(`http://localhost:8080/api/devices/device/${deviceId}`)
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

		console.log(
			`In onSendNotificationToServer, currentDeviceId is ${currentDeviceId},  receiverDeviceId is ${receiverDeviceId}, urlToBeShared is ${urlTobeShared}`,
		);

		axios
			.post("http://localhost:8080/api/subscription/sendnotification", {
				currentDeviceId,
				receiverDeviceId,
				urlTobeShared,
			})
			.then((sendNotificationToTheServerResponse) => {
				console.log(
					"URL is shared with the receiver : ",
					sendNotificationToTheServerResponse,
				);
				const { message } = sendNotificationToTheServerResponse.data;

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
					<div className="receiver__id">{recieverName}</div>
					<button type="button" onClick={onSendNotificationToTheServer}>
						{" "}
						Send
					</button>
				</>
			) : null}
			{/* <div className="receiver__id">{receiverDeviceId}</div> */}
		</div>
	);
};

export default ConnectionsRow;

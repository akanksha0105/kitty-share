import React, { useState } from "react";
import "../styles/ConnectionsRow.css";
import axios from "axios";

const ConnectionsRow = (props) => {
	const { receiverDeviceId, currentDeviceId, urlTobeShared } = props;

	console.log(
		`currentDeviceId is ${currentDeviceId},  receiverDeviceId is ${receiverDeviceId}, urlToBeShared is ${urlTobeShared}`,
	);
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
	return (
		<div className="connections__row">
			<div className="receiver__id">{receiverDeviceId}</div>
			<button type="button" onClick={onSendNotificationToTheServer}>
				{" "}
				Send
			</button>
		</div>
	);
};

export default ConnectionsRow;

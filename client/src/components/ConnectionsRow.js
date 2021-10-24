import React, { useState } from "react";
import "../styles/ConnectionsRow.css";
import axios from "axios";
import { Avatar } from "@material-ui/core";

const ConnectionsRow = (props) => {
	const { receiverDeviceId, currentDeviceId, urlTobeShared } = props;

	const onSendNotificationToTheServer = async () => {
		console.log("sendNotificationToTheServer in ConnectionRow component");
		return await axios
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
			{/* <h1>{props.receiverDeviceId}</h1> */}
			{/* <div className="receiver__avatar">
					<Avatar sx={{ width: 12, height: 12 }} />
				</div> */}
			{/* <span className="receiver__name">Happy Panda</span> */}
			<div className="receiver__id">{receiverDeviceId}</div>
			<button onClick={onSendNotificationToTheServer}> Send</button>
		</div>
	);
};

export default ConnectionsRow;

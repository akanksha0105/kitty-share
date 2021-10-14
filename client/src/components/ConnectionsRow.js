import React from "react";
import "../styles/ConnectionsRow.css";
import axios from "axios";

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
		<div className="connections__row" onClick={onSendNotificationToTheServer}>
			<div>
				<h1>{props.receiverDeviceId}</h1>
			</div>
		</div>
	);
};

export default ConnectionsRow;

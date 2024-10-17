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

	const onGetReceiverName = async () => {
		let deviceId = receiverDeviceId;
		return axios
			.get(`/api/devices/searchdevicename/${deviceId}`)
			.then((onGetReceiverNameResponse) => {
				if (onGetReceiverNameResponse.data.retrievedDeviceName === true)
					setReceiverName(onGetReceiverNameResponse.data.deviceName);
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const onSendNotificationToTheServer = (event) => {
		// event.preventDefault();

		let notificationSendingDevice = currentDeviceName;

		axios
			.post("/api/subscription/sendnotification", {
				currentDeviceId,
				receiverDeviceId,
				urlTobeShared,
				notificationSendingDevice,
			})
			.then((sendNotificationToTheServerResponse) => {
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
		<div className='connections__row'>
			{recieverName ? (
				<>
					<div className='left__side'>
						<div className='receiver__id'>{recieverName}</div>
					</div>
					<div className='right__side'>
						<button
							type='button'
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

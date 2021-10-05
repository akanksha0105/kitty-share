import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function SendToConnections() {
	const location = useLocation();
	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const onGetConnections = () => {
		let connectionsList = [];

		let device_id = location.state?.currentDeviceId.currentDeviceId;

		axios
			.get(`http://localhost:8080/api/connections/${device_id} `)
			.then((getConnectionsResponse) => {
				console.log(
					"In getting connections on client side in sendToConnections component",
				);

				console.log(getConnectionsResponse);
			})
			.catch((err) => {
				console.error(
					"Error encountered in getting connections on client side in sendToConnections component",
					err,
				);
			});
	};

	return (
		<div>
			<button onClick={onGetConnections}> click me</button>
		</div>
	);
}

export default SendToConnections;

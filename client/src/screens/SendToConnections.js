import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ConnectionsRow from "../components/ConnectionsRow";
import Message from "../components/Message";
import { getConnections } from "../functions/sendToConnectionsScreenFunctions";
import "../styles/SendToConnections.css";

function SendToConnections() {
	const location = useLocation();

	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const [connectionsList, setConnectionsList] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");

	const onGetConnections = async () => {
		let device_id = location.state?.currentDeviceId.currentDeviceId;
		getConnections(device_id)
			.then((getConnectionsPromiseResponse) => {
				const { data, connectionsExists } = getConnectionsPromiseResponse;
				if (connectionsExists === false) {
					console.log("No connections");
					setErrorMessage("No connections found");
					//Make a no connections component
					return;
				}

				setConnectionsList(data);
			})
			.catch((err) => {
				console.error(err);
				setErrorMessage(err.Message);
			});
	};
	useEffect(() => {
		onGetConnections();
	}, []);

	return (
		// <div className="connections__list">
		// 	{connectionsList
		// 		? connectionsList.map((item) => (
		// 				<ConnectionsRow
		// 					key={item.deviceId}
		// 					receiverDeviceId={item.deviceId}
		// 					currentDeviceId={currentDeviceId}
		// 					urlTobeShared={urlTobeShared}
		// 				/>
		// 		  ))
		// 		: null}
		// </div>

		<div className="connections__list">
			{connectionsList ? (
				connectionsList.map((item) => (
					<ConnectionsRow
						key={item.deviceId}
						receiverDeviceId={item.deviceId}
						currentDeviceId={currentDeviceId}
						urlTobeShared={urlTobeShared}
					/>
				))
			) : (
				<>
					Error Message her {errorMessage}
					{errorMessage.length > 0 ? <Message message={errorMessage} /> : null}
				</>
			)}
		</div>
	);
}

export default SendToConnections;

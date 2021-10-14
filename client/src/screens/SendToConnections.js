import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ConnectionsRow from "../components/ConnectionsRow";
import { getConnections } from "../functions/sendToConnectionsScreenFunctions";

function SendToConnections() {
	const location = useLocation();

	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const [connectionsList, setConnectionsList] = useState([]);

	const onGetConnections = async () => {
		let device_id = location.state?.currentDeviceId.currentDeviceId;
		getConnections(device_id)
			.then((getConnectionsPromiseResponse) => {
				const { data, connectionsExists } = getConnectionsPromiseResponse;
				if (connectionsExists === false) {
					console.log("No connections");
					//Make a no connections component
					return;
				}

				setConnectionsList(data);
			})
			.catch((err) => {
				console.error(err);
			});
	};
	useEffect(() => {
		onGetConnections();
	}, []);

	return (
		<div>
			{connectionsList &&
				connectionsList.map((item) => (
					<ConnectionsRow
						key={item.deviceId}
						receiverDeviceId={item.deviceId}
						currentDeviceId={currentDeviceId}
						urlTobeShared={urlTobeShared}
					/>
				))}
		</div>
	);
}

export default SendToConnections;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ConnectionsRow from "../ConnectionsRow";

function SendToConnections() {
	const location = useLocation();

	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const [connectionsList, setConnectionsList] = useState([]);

	const onGetConnections = async () => {
		let device_id = location.state?.currentDeviceId.currentDeviceId;

		return await axios
			.get(`http://localhost:8080/api/connections/${device_id} `)
			.then((getConnectionsResponse) => {
				console.log(
					"In getting connections on client side in sendToConnections component",
					getConnectionsResponse,
				);

				var data = getConnectionsResponse.data.message;
				//	console.log(data);
				//	console.log({ data });
				setConnectionsList({ data });
				//console.log(connectionsList);
				// const array = [
				// 	...getConnectionsResponse.data.message.map((connection) => {
				// 		return connection.deviceId;
				// 	}),
				// ];

				// //return getConnectionsResponse.data.message;
				// return array;

				//getConnectionsResponse.data.mes;
			})
			.catch((err) => {
				console.error(
					"Error encountered in getting connections on client side in sendToConnections component",
					err,
				);
			});
	};
	useEffect(() => {
		onGetConnections();
		// onGetConnections().then((connectionsList) => {
		// 	console.log("connectionsArraylist", connectionsList);
		// 	setConnectionsList({ connectionsList });
		// 	console.log("Finally", typeof [...connectionsList]);
		// });
	}, []);

	return (
		<div>
			{connectionsList.data &&
				connectionsList.data.map((item) => (
					<ConnectionsRow
						key={item.deviceId}
						receiverDeviceId={item.deviceId}
						currentDeviceId={currentDeviceId}
						urlTobeShared={urlTobeShared}
					/>
				))}

			{/* {[
				...connectionsList.map((item) => {
					return <div>{item} </div>;
				}),
			]} */}
		</div>
	);
}

export default SendToConnections;

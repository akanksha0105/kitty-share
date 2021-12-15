import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import ConnectionsRow from "../components/ConnectionsRow";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/SendToConnections.css";
import Loading from "../components/Loading";
import PromptToSubscribe from "./PromptToSubscribe";
// import ErrorMessage from "../components/ErrorMessage";
import axios from "axios";

function SendToConnections(props) {
	// const location = useLocation();
	// const urlTobeShared = location.state?.url;
	// const currentDeviceId = location.state?.currentDeviceId;

	const {
		currentDeviceId,
		sharedInput,
		currentDeviceName,
		isDeviceSubscribed,
	} = props;
	const [connectionsList, setConnectionsList] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");

	const onGetAllConnections = () => {
		console.log(
			"In onGetAllConnections function in SendToConnections component",
		);

		let deviceId = currentDeviceId;

		axios
			.get(
				`http://localhost:8080/api/connections/getAllConnections/${deviceId}`,
			)
			.then((onGetAllConnectionsResponse) => {
				console.log("onGetAllConnectionsResponse", onGetAllConnectionsResponse);

				if (onGetAllConnectionsResponse.data.connectionsExists === true)
					setConnectionsList(
						onGetAllConnectionsResponse.data.getAllConnectionsArray,
					);
			})
			.catch((err) => {
				console.error(
					"Error in retrieving connections on the client side : ",
					err,
				);
				const { code, message } = err.response.data;
				console.log(`code is ${code}, message is ${message} `);
				setErrorMessage(message);
			});

		// console.log(connectionsList);
	};
	useEffect(() => {
		// setInterval(() => {
		// 	onGetAllConnections();
		// }, 10000);
		onGetAllConnections();
		// console.log("Connections List length : ", connectionsList.length);
	}, [isDeviceSubscribed]);

	if (connectionsList === null) return <Loading />;
	if (isDeviceSubscribed === false) {
		let message = "You need to subscribe to notifications to send messages";
		return <ErrorMessage message={message} />;
	}
	// if (isDeviceSubscribed === true && connectionsList.length === 0) {
	// 	let message = "No connections";
	// 	return <ErrorMessage message={message} />;
	// }

	return (
		<>
			<div
				className={
					connectionsList.length > 0 && isDeviceSubscribed
						? "connections__list"
						: "connections__list__display__none"
				}>
				{connectionsList && isDeviceSubscribed
					? connectionsList.map((item) => (
							<ConnectionsRow
								key={item}
								receiverDeviceId={item}
								currentDeviceId={currentDeviceId}
								urlTobeShared={sharedInput}
								currentDeviceName={currentDeviceName}
							/>
					  ))
					: null}
			</div>
			{errorMessage ? <ErrorMessage message={errorMessage} /> : null}
		</>
	);
}

export default SendToConnections;

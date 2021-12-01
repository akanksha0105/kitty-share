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

	const { currentDeviceId, sharedInput, currentDeviceName } = props;
	const [connectionsList, setConnectionsList] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	let currentlySubscribed = JSON.parse(localStorage.getItem("isSubscribed"));
	// const [isCurrentlySubscribed, setIsCurrentlySubscribed] =
	// useState(currentlySubscribed);
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

				if (onGetAllConnectionsResponse.data.connectionExists === true)
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
	};
	useEffect(() => {
		onGetAllConnections();
	}, []);

	if (connectionsList === null) return <Loading />;
	if (currentlySubscribed === false) {
		let message = "You need to subscribe to notifications to send messages";
		return <ErrorMessage message={message} />;
	}
	return (
		<div
			className={
				connectionsList
					? "connections__list"
					: "connections__list__display__none"
			}>
			{connectionsList && currentlySubscribed
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
			<>{errorMessage ? <ErrorMessage message={errorMessage} /> : null}</>
		</div>
	);
}

export default SendToConnections;

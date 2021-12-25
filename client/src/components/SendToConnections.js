import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import ConnectionsRow from "../components/ConnectionsRow";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/SendToConnections.css";
import Loading from "../components/Loading";
import PromptToSubscribe from "./PromptToSubscribe";
import { Link } from "react-router-dom";
// import ErrorMessage from "../components/ErrorMessage";
import axios from "axios";
import "../styles/AddDeviceModal.css";

function SendToConnections(props) {
	// const location = useLocation();
	// const urlTobeShared = location.state?.url;
	// const currentDeviceId = location.state?.currentDeviceId;
	const [show, setShow] = useState(false);
	let displayMessage = `To send messages, you need to add a device`;
	const {
		currentDeviceId,
		sharedInput,
		currentDeviceName,
		isDeviceSubscribed,
	} = props;
	const [connectionsList, setConnectionsList] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");

	const hideModal = () => {
		setShow(false);
	};

	const onGetAllConnections = () => {
		console.log(
			"In onGetAllConnections function in SendToConnections component",
		);

		let deviceId = currentDeviceId;

		axios
			.get(`/api/connections/getAllConnections/${deviceId}`)
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

				if (code === 102) {
					//
					setShow(true);
					return;
				}

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
		let message = "You need to subscribe to send messages";
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
			<div className={show ? "modal display-block" : "modal display-none"}>
				<div className="add__device__modal__header">No Connections</div>
				{/* <div className="line__separator"></div> */}
				<div className="add__device__modal__message">{displayMessage}</div>
				<div className="add__device__modal__options">
					<button type="button" className="button" onClick={hideModal}>
						Close
					</button>

					<Link to="/linktoanewdevice">
						<button type="button" className="button">
							Add Device
						</button>
					</Link>
				</div>
			</div>
		</>
	);
}

export default SendToConnections;

import React, { useState } from "react";
import "../styles/CodeInputScreen.css";
import {
	retrieveMessage,
	checkIfDeviceCanBeAddedAsConnection,
} from "../functions/codeInputScreenFunctions";

import { linkDevices } from "../functions/functions";
import "../styles/Modal.css";
import Message from "../components/Message";

import RetrievedMessageScreen from "./RetrievedMessageScreen";

function CodeInputScreen({ currentDeviceId }) {
	console.log("In CodeInputScreen Component");
	console.log(currentDeviceId);

	const [codeInputValue, setCodeInputValue] = useState("");
	const [retrievedMessage, setRetrievedMessage] = useState("");

	const [deviceToBeAdded, setDeviceToBeAdded] = useState("");
	const [addDeviceMessage, setAddDeviceMessage] = useState("");
	const [show, setShow] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [newDeviceAdded, setNewDeviceAdded] = useState("");

	const hideModal = () => {
		setShow(false);
	};

	const onGenerateMessage = (event) => {
		event.preventDefault();
		console.log("Form submitted");

		setNewDeviceAdded("");

		console.log("Code key entered for the URL retrieval", codeInputValue);
		let newDevice;

		retrieveMessage(codeInputValue)
			.then((retrieveMessageResponse) => {
				console.log("retrieveMessageResponse", retrieveMessageResponse);
				if (retrieveMessageResponse.messageRetrieved === false) {
					setRetrievedMessage(retrieveMessageResponse.data);
					// setErrorMessage(retrieveMessageResponse.data);
					return false;
				}

				const { data, device } = retrieveMessageResponse;
				newDevice = device;

				setDeviceToBeAdded(device);
				setRetrievedMessage(data);

				return checkIfDeviceCanBeAddedAsConnection(currentDeviceId, device);
			})
			.then((checkIfDeviceCanBeAddedAsConnectionResponse) => {
				console.log(
					"checkIfDeviceCanBeAddedAsConnectionResponse",
					checkIfDeviceCanBeAddedAsConnectionResponse,
				);

				if (checkIfDeviceCanBeAddedAsConnectionResponse === false) {
					return;
				}

				setShow(true);

				setAddDeviceMessage(
					`Do you want to add ${newDevice} to your connections ? `,
				);
			})
			.catch((err) => {
				console.error(
					"Unable to generate the message and connect new device",
					err,
				);
				setRetrievedMessage("Unable to retrieve the message ");
			});
	};

	//Event handler for adding the device that stored the code to the connections
	const addDevice = () => {
		hideModal();
		console.log("In addToDevice function of CodeInputScreen component");

		let receiverDeviceID = deviceToBeAdded;

		linkDevices(currentDeviceId, receiverDeviceID)
			.then((linkDevicesResponse) => {
				console.log("linkDevicesResponse", linkDevicesResponse);

				if (linkDevicesResponse.linked === true) {
					setNewDeviceAdded("Both the devices are connected");
					return;
				}
			})
			.catch((err) => {
				console.error("Unable to link both the devices", err);

				setNewDeviceAdded("Unable to link both the devices");
			});
	};
	return (
		<div className="code__input__screen">
			<div className="input__key__form">
				<form onSubmit={onGenerateMessage}>
					<label>
						<input
							name="name"
							id="name"
							type="text"
							value={codeInputValue}
							onChange={(event) => setCodeInputValue(event.target.value)}
							required
						/>
						<div className="label-text">Enter the Input Key</div>
					</label>
					<br />

					<button
						className="button__1"
						type="submit"
						disabled={codeInputValue.length > 0 ? false : true}>
						Retrieve the Message
					</button>
				</form>
				{/* {errorMessage ? <Message message={errorMessage} /> : null} */}
			</div>
			{retrievedMessage ? (
				<RetrievedMessageScreen retrievedMessage={retrievedMessage} />
			) : null}
			<div className={show ? "modal display-block" : "modal display-none"}>
				<div className="modal__message">{addDeviceMessage}</div>
				<div className="modal__options">
					<button type="button" className="button__1" onClick={hideModal}>
						No
					</button>
					<button type="button" className="button__1" onClick={addDevice}>
						Yes
					</button>
				</div>
			</div>
			{newDeviceAdded ? <Message message={newDeviceAdded} /> : null}
		</div>
	);
}

export default CodeInputScreen;

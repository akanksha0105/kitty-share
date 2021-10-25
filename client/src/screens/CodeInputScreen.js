import React, { useState } from "react";
import "../styles/CodeInputScreen.css";
import {
	retrieveMessage,
	checkIfDeviceCanBeAddedAsConnection,
} from "../functions/codeInputScreenFunctions";
import "../styles/Modal.css";
import Message from "../components/Message";
import axios from "axios";
import RetrievedMessageScreen from "./RetrievedMessageScreen";

function CodeInputScreen({ currentDeviceId }) {
	console.log("In CodeInputScreen Component");
	console.log(currentDeviceId);

	const [codeInputValue, setCodeInputValue] = useState("");
	const [retrievedMessage, setRetrievedMessage] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);
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

		console.log("Code key entered for the URL retrieval", codeInputValue);
		let newDevice;

		retrieveMessage(codeInputValue)
			.then((retrieveMessageResponse) => {
				console.log("retrieveMessageResponse", retrieveMessageResponse);
				if (retrieveMessageResponse.messageRetrieved === false) {
					setRetrievedMessage(retrieveMessageResponse.data);
					setErrorMessage(retrieveMessageResponse.data);
					return false;
				}

				const { data, device } = retrieveMessageResponse;
				newDevice = device;
				setDeviceToBeAdded(device);
				setRetrievedMessage(data);
				setIsDisabled(!isDisabled);

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
		//Here,  receiverDeviceId= The device that stored the code

		// handleClose();
		hideModal();
		console.log("In addToDevice function of CodeInputScreen component");

		let device_id = currentDeviceId;
		let receiverDeviceID = deviceToBeAdded;

		console.log(
			"deviceToBeAdded in codeInputScreen Component",
			deviceToBeAdded,
		);

		console.log("device_id in addReceiverToTheDeviceConnectionList", device_id);

		axios
			.post(`http://localhost:8080/api/connections/${device_id}`, {
				receiverDeviceID,
			})
			.then((addReceiverToListResponse) => {
				console.log(addReceiverToListResponse.data.data);
				setNewDeviceAdded("New connection created");
			})
			.catch((err) => {
				console.error(
					"Issue in saving the device to the connections list",
					err,
				);
				setNewDeviceAdded("Issue in saving the device to the connections list");
			});
	};
	return (
		<div
			className={
				!isDisabled ? "code__input__screen " : "message__retrieval__screen"
			}>
			{!isDisabled ? (
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

						<button type="submit">Retrieve the Message</button>
					</form>
					{errorMessage ? <Message message={errorMessage} /> : null}
				</div>
			) : (
				<>
					<RetrievedMessageScreen retrievedMessage={retrievedMessage} />

					<div className={show ? "modal display-block" : "modal display-none"}>
						<div className="modal__message">{addDeviceMessage}</div>
						<div className="modal__options">
							<button type="button" onClick={hideModal}>
								No
							</button>
							<button type="button" onClick={addDevice}>
								Yes
							</button>
						</div>
					</div>

					{newDeviceAdded ? <Message message={newDeviceAdded} /> : null}
				</>
			)}
		</div>
	);
}

export default CodeInputScreen;

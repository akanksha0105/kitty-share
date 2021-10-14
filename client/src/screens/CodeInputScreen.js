import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "../styles/styles.css";
import {
	retrieveMessage,
	checkIfDeviceCanBeAddedAsConnection,
	checkDeviceIsAnExistingConnection,
} from "../functions/codeInputScreenFunctions";

function CodeInputScreen(props) {
	const { currentDeviceId } = props;

	const [isDisabled, setIsDisabled] = useState(false);
	const [codeInputValue, setCodeInputValue] = useState("");
	const [retrievedMessage, setRetrievedMessage] = useState("");
	const [deviceToBeAdded, setDeviceToBeAdded] = useState("");
	const [addDeviceMessage, setAddDeviceMessage] = useState("");
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);

	const onGenerateMessage = (event) => {
		event.preventDefault();
		console.log("Code key entered for the URL retrieval", codeInputValue);
		let newDevice;

		retrieveMessage(codeInputValue)
			.then((retrieveMessageResponse) => {
				console.log("retrieveMessageResponse", retrieveMessageResponse);
				if (retrieveMessageResponse.messageRetrieved === false) {
					setRetrievedMessage(retrieveMessageResponse.data);
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

		handleClose();
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
				console.log(addReceiverToListResponse);
				console.log(addReceiverToListResponse.data.data);
				//Need to display the above thing
			})
			.catch((err) => {
				console.error(
					"Issue in saving the device to the connections list",
					err,
				);
			});
	};

	return (
		<div className="code__input__screen">
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

						<button type="submit">Generate the Message</button>
					</form>
				</div>
			) : (
				<div className="message__generated__form">
					<form>
						<label>
							{retrievedMessage}
							<div className="label-text">Generated Message</div>
						</label>
						<br />
					</form>
					<div className="modal">
						<Modal show={show} onHide={handleClose}>
							<Modal.Body>{addDeviceMessage}</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={handleClose}>
									No
								</Button>
								{/* <Button variant="primary" onClick={handleClose}> */}
								<Button variant="primary" onClick={addDevice}>
									Yes
								</Button>
							</Modal.Footer>
						</Modal>
					</div>
				</div>
			)}
			<Link to="/text">
				<button>Move to the Text Input Screen</button>
			</Link>
		</div>
	);
}

export default CodeInputScreen;

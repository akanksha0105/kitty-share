import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./styles.css";
//import MessageGeneratedScreen from "./MessageGeneratedScreen";

function CodeInputScreen(props) {
	const { currentDeviceId } = props;

	const [isDisabled, setIsDisabled] = useState(false);
	const [codeInputValue, setCodeInputValue] = useState("");
	const [retrievedMessage, setRetrievedMessage] = useState("");
	const [addDeviceMessage, setAddDeviceMessage] = useState("");
	const [deviceToBeAdded, setDeviceToBeAdded] = useState("");
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const onGenerateMessage = (event) => {
		event.preventDefault();
		console.log("Secret key for the URL entered");
		retrieveMessage();
		setIsDisabled(!isDisabled);
	};

	const retrieveMessage = async () => {
		const codedMessage = codeInputValue;

		let retrievedMessagePromise = axios.post(
			"http://localhost:8080/api/code/getcodegenerated",
			{
				codedMessage,
			},
		);

		retrievedMessagePromise
			.then((response) => {
				console.log(response);
				//Setting the URL derived fron the backend
				setRetrievedMessage(response.data.data);
				console.log("URL provided by the server", retrievedMessage);
				console.log(response.data.device);
				console.log(response.data.message);
				setAddDeviceMessage(response.data.message);
				setDeviceToBeAdded(response.data.device);
				console.log(currentDeviceId);
				var x = JSON.stringify(currentDeviceId);
				var y = deviceToBeAdded;
				console.log(x);
				console.log(y);
				// if (x.localeCompare(y)) {
				// 	console.log("The sender and the receiver devices are same");
				// 	setShow(false);
				// } else {
				setShow(true);
				// }
			})
			.catch((error) => console.log(error.response.data));
	};

	//Event handler for adding the device that stored the code to the connections
	const addDevice = async () => {
		//Here,  receiverDeviceId= The device that stored the code
		// senderDeviceId = current deviceId

		handleClose();
		console.log("In addToDevice function of CodeInputScreen component");

		console.log(
			"currentDeviceId in codeInputScreen Component",
			currentDeviceId,
		);

		let device_id = currentDeviceId;
		let receiverDeviceID = deviceToBeAdded;

		console.log("device_id in addReceiverToTheDeviceConnectionList", device_id);

		return axios
			.post(`http://localhost:8080/api/connections/${device_id}`, {
				receiverDeviceID,
			})
			.then((addReceiverToListResponse) => {
				console.log(addReceiverToListResponse);
				// console.log(addReceiverToListResponse.data.data);
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
			)}
			<Link to="/text">
				<button>Move to the Text Input Screen</button>
			</Link>
		</div>
	);
}

export default CodeInputScreen;

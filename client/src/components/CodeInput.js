import React, { useEffect, useState } from "react";
import "../styles/CodeInputScreen.css";
import {
	retrieveMessage,
	checkIfDeviceCanBeAddedAsConnection,
	getReceiverDeviceName,
} from "../functions/codeInputScreenFunctions";

import { linkDevices } from "../functions/functions";
import "../styles/Modal.css";
import Message from "./Message";

import RetrievedMessageScreen from "./RetrievedMessageScreen";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
function CodeInput({
	currentDeviceId,
	displayTextInputComponent,
	showTextInput,
	showCodeInput,
}) {
	const [codeInputValue, setCodeInputValue] = useState("");
	const [retrievedMessage, setRetrievedMessage] = useState("");
	const [deviceToBeAdded, setDeviceToBeAdded] = useState("");
	const [show, setShow] = useState(false);
	const [newDeviceAdded, setNewDeviceAdded] = useState("");
	const [addDeviceMessage, setAddDeviceMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isRetrieveMessageButtonDisabled, setIsRetrieveMessageButtonDisabled] =
		useState(true);
	const [retrieveMessageButtonText, setRetriveMessageButtonText] = useState(
		"Retrieve the Message",
	);
	const [noTextErrorMessage, setNoTextErrorMessage] = useState("");
	const hideModal = () => {
		setShow(false);
	};

	const onGenerateMessage = (event) => {
		event.preventDefault();

		if (codeInputValue.length <= 0) {
			setNoTextErrorMessage("Please fill in the above field");
			return;
		}
		setIsRetrieveMessageButtonDisabled(true);
		setRetriveMessageButtonText("Retrieving...");
		setNewDeviceAdded("");
		setErrorMessage("");
		setSuccessMessage("");

		retrieveMessage(codeInputValue)
			.then((retrieveMessageResponse) => {
				if (retrieveMessageResponse.messageRetrieved === false) {
					setErrorMessage(retrieveMessageResponse.data);
					setIsRetrieveMessageButtonDisabled(false);
					setRetriveMessageButtonText("Retrieve Message Again");
					return false;
				}

				const { data, device } = retrieveMessageResponse;

				setDeviceToBeAdded(device);
				setRetrievedMessage(data);
				setIsRetrieveMessageButtonDisabled(false);
				setRetriveMessageButtonText("Retrieve Message Again");

				return checkIfDeviceCanBeAddedAsConnection(currentDeviceId, device);
			})
			.then((checkIfDeviceCanBeAddedAsConnectionResponse) => {
				if (
					checkIfDeviceCanBeAddedAsConnectionResponse.canBeAddedAsConnection ===
					false
				) {
					return { retrievedDeviceName: false };
				}

				return getReceiverDeviceName(
					checkIfDeviceCanBeAddedAsConnectionResponse.deviceToBeAdded,
				);
			})
			.then((getReceiverDeviceNameResponse) => {
				if (getReceiverDeviceNameResponse.retrievedDeviceName === true) {
					setShow(true);

					let newDeviceMessage =
						getReceiverDeviceNameResponse.receiverDeviceName;
					setAddDeviceMessage(
						`Do you want to add ${newDeviceMessage} to your connections ? `,
					);
				}
			})
			.catch((err) => {
				console.error(
					"Unable to generate the message and connect new device",
					err,
				);

				setErrorMessage("Unable to retrieve the message ");
			});
	};

	//Event handler for adding the device that stored the code to the connections
	const addDevice = () => {
		hideModal();

		let receiverDeviceID = deviceToBeAdded;

		linkDevices(currentDeviceId, receiverDeviceID)
			.then((linkDevicesResponse) => {
				if (linkDevicesResponse.linked === true) {
					// setNewDeviceAdded("Both the devices are connected");
					setSuccessMessage("Both the devices are connected");
					return;
				}
			})
			.catch((err) => {
				console.error("Unable to link both the devices", err);

				// setNewDeviceAdded("Unable to link both the devices");
				setErrorMessage("Unable to link both the devices");
			});
	};

	const getCodeInputScreenName = () => {
		if (showTextInput === true && showCodeInput === false) {
			return "display-none";
		} else if (showTextInput === false && showCodeInput === true) {
			return "alternative__code__input__screen";
		} else if (showTextInput === true && showCodeInput === true) {
			return "code__input__screen";
		}
	};
	useEffect(() => {
		if (codeInputValue.length > 0) setNoTextErrorMessage("");
	}, [codeInputValue]);
	return (
		<div className={getCodeInputScreenName()}>
			<div className='form__div'>
				<form className='code__form' onSubmit={onGenerateMessage}>
					<label>
						<input
							name='name'
							id='name'
							type='text'
							value={codeInputValue}
							onChange={(event) => setCodeInputValue(event.target.value)}
							required
						/>
						<div className='label-text'>Enter the Input Key</div>
					</label>
					{/* <br /> */}
					{noTextErrorMessage ? (
						<div className='no__text__error__message'>
							<ErrorMessage message={noTextErrorMessage} />
						</div>
					) : null}
					<button
						onClick={displayTextInputComponent}
						className='button__1'
						type='submit'
						// disabled={isRetrieveMessageButtonDisabled}
					>
						{retrieveMessageButtonText}
					</button>
				</form>

				{retrievedMessage ? (
					<RetrievedMessageScreen retrievedMessage={retrievedMessage} />
				) : null}
				<div className={show ? "modal display-block" : "modal display-none"}>
					<div className='modal__message'>{addDeviceMessage}</div>
					<div className='modal__options'>
						<button
							type='button'
							className='choice__button'
							onClick={hideModal}>
							No
						</button>
						<button
							type='button'
							className='choice__button'
							onClick={addDevice}>
							Yes
						</button>
					</div>
				</div>
				{newDeviceAdded ? <Message message={newDeviceAdded} /> : null}
				{errorMessage ? <ErrorMessage message={errorMessage} /> : null}
				{successMessage ? <SuccessMessage message={successMessage} /> : null}
			</div>
		</div>
	);
}

export default CodeInput;

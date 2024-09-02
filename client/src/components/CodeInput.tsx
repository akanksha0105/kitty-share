import React, { useEffect, useState } from "react";
import "../styles/CodeInputScreen.css";
import {
	retrieveMessage,
	checkIfDeviceCanBeAddedAsConnection,
	getReceiverDeviceName,
	retrieveMessageType,
	getReceiverDeviceNameResponseType,
} from "../functions/codeInputScreenFunctions";

import { linkDevices, LinkDevicesResponseType } from "../functions/functions";
import "../styles/Modal.css";
import Message from "./Message";

import RetrievedMessageScreen from "./RetrievedMessageScreen";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

interface CodeInputProps {
	currentDeviceId: string;
	displayTextInputComponent: () => void;
	showTextInput: boolean;
	showCodeInput: boolean;
}

interface checkIfDeviceCanBeAddedAsConnectionType {
	canBeAddedAsConnection: boolean;
	device?: string;
}



const CodeInput: React.FC<CodeInputProps> = ({
	currentDeviceId,
	displayTextInputComponent,
	showTextInput,
	showCodeInput,
}) => {

	const [codeInputValue, setCodeInputValue] = useState<string>("");
	const [retrievedMessage, setRetrievedMessage] = useState<string>("");
	const [deviceToBeAdded, setDeviceToBeAdded] = useState<string>("");
	const [show, setShow] = useState<boolean>(false);
	const [newDeviceAdded, setNewDeviceAdded] = useState<string>("");
	const [addDeviceMessage, setAddDeviceMessage] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");
	const [isRetrieveMessageButtonDisabled, setIsRetrieveMessageButtonDisabled] =
		useState<boolean>(true);
	const [retrieveMessageButtonText, setRetrieveMessageButtonText] = useState<string>(
		"Retrieve the Message",
	);
	const [noTextErrorMessage, setNoTextErrorMessage] = useState<string>("");

	const hideModal = () => {
		setShow(false);
	};

	const onGenerateMessage = async (event: React.FormEvent): Promise<void> => {
		event.preventDefault();

		if (codeInputValue.length <= 0) {
			setNoTextErrorMessage("Please fill in the above field");
			return;
		}
		setIsRetrieveMessageButtonDisabled(true);
		setRetrieveMessageButtonText("Retrieving...");
		setNewDeviceAdded("");
		setErrorMessage("");
		setSuccessMessage("");

		try {
			const retrieveMessageResponse: retrieveMessageType = await retrieveMessage(codeInputValue);
			if (retrieveMessageResponse.messageRetrieved === false) {
				setErrorMessage(retrieveMessageResponse.data);
				setIsRetrieveMessageButtonDisabled(false);
				setRetrieveMessageButtonText("Retrieve Message Again");
				return;
			}

			const { data, device = "" } = retrieveMessageResponse;

			setDeviceToBeAdded(device);
			setRetrievedMessage(data);
			setIsRetrieveMessageButtonDisabled(false);
			setRetrieveMessageButtonText("Retrieve Message Again");

			const checkIfDeviceCanBeAddedAsConnectionResponse: checkIfDeviceCanBeAddedAsConnectionType = await checkIfDeviceCanBeAddedAsConnection(currentDeviceId, device);

			if (
				checkIfDeviceCanBeAddedAsConnectionResponse.canBeAddedAsConnection && checkIfDeviceCanBeAddedAsConnectionResponse.device
			) {
				const getReceiverDeviceNameResponse: getReceiverDeviceNameResponseType = await getReceiverDeviceName(
					checkIfDeviceCanBeAddedAsConnectionResponse.device,
				);


				if (getReceiverDeviceNameResponse.retrievedDeviceName) {
					setShow(true);

					let newDeviceMessage =
						getReceiverDeviceNameResponse.retrievedDeviceName;
					setAddDeviceMessage(
						`Do you want to add ${newDeviceMessage} to your connections ? `,
					);
				}
			}


		}

		catch (err: unknown) {
			console.error(
				"Unable to generate the message and connect new device",
				err,
			);

			setErrorMessage("Unable to retrieve the message ");
		};
	};

	//Event handler for adding the device that stored the code to the connections
	const addDevice = async (): Promise<void> => {

		try {
			hideModal();
			let receiverDeviceID = deviceToBeAdded;
			const linkDevicesResponse: LinkDevicesResponseType = await linkDevices(currentDeviceId, receiverDeviceID);
			if (linkDevicesResponse.linked) {
				setSuccessMessage("Both the devices are connected");
				return;
			}

		}

		catch (error) {
			console.error("Unable to link both the devices", error);
			setErrorMessage("Unable to link both the devices");

		};
		return;
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
		<div
			className={getCodeInputScreenName()}>
			<div className="form__div">
				<form className="code__form" onSubmit={onGenerateMessage}>
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
					{/* <br /> */}
					{noTextErrorMessage ? (
						<div className="no__text__error__message">
							<ErrorMessage message={noTextErrorMessage} />
						</div>
					) : null}
					<button
						onClick={displayTextInputComponent}
						className="button__1"
						type="submit"
					// disabled={isRetrieveMessageButtonDisabled}
					>
						{retrieveMessageButtonText}
					</button>
				</form>

				{retrievedMessage ? (
					<RetrievedMessageScreen retrievedMessage={retrievedMessage} />
				) : null}
				<div className={show ? "modal display-block" : "modal display-none"}>
					<div className="modal__message">{addDeviceMessage}</div>
					<div className="modal__options">
						<button
							type="button"
							className="choice__button"
							onClick={hideModal}>
							No
						</button>
						<button
							type="button"
							className="choice__button"
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
};

export default CodeInput;

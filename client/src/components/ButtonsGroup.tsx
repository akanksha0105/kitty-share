import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import SendToConnections from "./SendToConnections";
import KeyGeneratedScreen from "./KeyGeneratedScreen";
import ErrorMessage from "./ErrorMessage";
import { client, config } from "../axios/axios";

interface ButtonsGroupProps {
	sharedInput: string,
	currentDeviceId: string,
	currentDeviceName: string,
	isDeviceSubscribed: boolean,
	displayErrorMessage: () => void,
	displayCodeInputComponent: () => void,
}

const ButtonsGroup: React.FC<ButtonsGroupProps> = (props) => {
	const {
		sharedInput,
		currentDeviceId,
		currentDeviceName,
		isDeviceSubscribed,
		displayErrorMessage,
		displayCodeInputComponent,
	} = props;

	const [buttonOneDisabled, setButtonOneDisabled] = useState(false);
	const [buttonTwoDisabled, setButtonTwoDisabled] = useState(false);
	const [sendConnectionsComponentEnabled, setConnectionsComponentEnabled] =
		useState(false);
	const [KeyGeneratedComponentEnabled, setKeyGeneratedComponentEnabled] =
		useState(false);
	const [generatedCode, setGeneratedCode] = useState("");
	const [generateKeyButtonText, setGenerateKeyButtonText] =
		useState("Generate the Key");

	const [isGenerateKeyButtonDisabled, setIsGenerateKeyButtonDisabled] =
		useState(true);
	const [noTextErrorMessage, setNoTextErrorMessage] = useState("");

	const generateSecretKey = async () => {
		try {
			let valueOfTheURL = sharedInput;
			let senderDeviceId = currentDeviceId;
			let secretKey: AxiosResponse = await client.post("/api/code/postthevalue", {
				valueOfTheURL,
				senderDeviceId,
			}, config);

			setGeneratedCode(secretKey.data.data);
			setGenerateKeyButtonText("Generate Key again");
			setIsGenerateKeyButtonDisabled(false);

		} catch (error) {
			console.error(error);
		}

	};

	const sendConnectionsEnabled = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();
		displayCodeInputComponent();
		setKeyGeneratedComponentEnabled(false);
		if (sharedInput.length <= 0) {
			// displayErrorMessage();
			setNoTextErrorMessage("Please fill in the above field");
			return;
		}
		setButtonOneDisabled(true);

		setButtonTwoDisabled(true);
		setConnectionsComponentEnabled(true);
	};

	const keyGeneratedEnabled = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();
		displayCodeInputComponent();
		setConnectionsComponentEnabled(false);
		if (sharedInput.length <= 0) {
			// displayErrorMessage();
			setNoTextErrorMessage("Please fill in the above field");
			return;
		}
		setGenerateKeyButtonText("Generating key ...");
		setIsGenerateKeyButtonDisabled(true);
		generateSecretKey();

		setButtonTwoDisabled(true);
		setKeyGeneratedComponentEnabled(true);
	};

	useEffect(() => {
		if (sharedInput.length > 0) setNoTextErrorMessage("");
	}, [sharedInput]);

	return (
		<>
			<div className="text__input__screen__buttons">
				{/* <div> */}
				{noTextErrorMessage ? (
					<div className="no__text__error__message">
						<ErrorMessage message={noTextErrorMessage} />
					</div>
				) : null}
				<button
					onClick={keyGeneratedEnabled}
					className="button__1"
					type="submit"

				>
					{generateKeyButtonText}
				</button>

				<button
					onClick={sendConnectionsEnabled}
					className="button__2"
					type="submit"
				>
					Send to Connections
				</button>
				{/* </div> */}
			</div>

			{sendConnectionsComponentEnabled ? (
				<SendToConnections
					currentDeviceId={currentDeviceId}
					sharedInput={sharedInput}
					currentDeviceName={currentDeviceName}
					isDeviceSubscribed={isDeviceSubscribed}
				/>
			) : null}

			{KeyGeneratedComponentEnabled ? (
				<KeyGeneratedScreen generatedCode={generatedCode} />
			) : null}
		</>
	);
};

export default ButtonsGroup;

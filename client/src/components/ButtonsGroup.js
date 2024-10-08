import React, { useState, useEffect } from "react";
import axios from "axios";
import SendToConnections from "./SendToConnections";
import KeyGeneratedScreen from "./KeyGeneratedScreen";
import ErrorMessage from "./ErrorMessage";

function ButtonsGroup(props) {
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
		let valueOfTheURL = sharedInput;
		let senderDeviceId = currentDeviceId;
		let secretKeyPromise = axios.post("/api/code/postthevalue", {
			valueOfTheURL,
			senderDeviceId,
		});

		secretKeyPromise
			.then((response) => {
				setGeneratedCode(response.data.data);
				console.log("response", response.data);
				setGenerateKeyButtonText("Generate Key again");
				setIsGenerateKeyButtonDisabled(false);
				console.log("Generated Key provided by the server");
			})
			.catch((error) => {
				const { code } = error.response.data;
				if (code === 102) {
					return console.error("Code does not exist");
				}

				console.error("Unable to generate code");
			});
	};

	const sendConnectionsEnabled = (event) => {
		event.preventDefault();
		displayCodeInputComponent();
		console.log("In the sendConnectionsComponentEnabled");
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

	const keyGeneratedEnabled = (event) => {
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
		console.log("sharedInput", sharedInput);

		// if (sharedInput.length <= 0) {
		// 	setNoTextErrorMessage("Please fill in the above field");
		// } else {
		// 	setNoTextErrorMessage("");
		// }

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
					// className={buttonOneDisabled ? "display-none" : "button__1"}
					className="button__1"
					type="submit"
					// disabled={sharedInput.length > 0 ? false : true}>
					// disabled={isGenerateKeyButtonDisabled}
				>
					{generateKeyButtonText}
				</button>
				{/* </div> */}
				{/* <div> */}
				<button
					onClick={sendConnectionsEnabled}
					// className={buttonTwoDisabled ? "display-none" : "button__2"}
					className="button__2"
					type="submit"
					// disabled={sharedInput.length > 0 ? false : true}
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
}

export default ButtonsGroup;

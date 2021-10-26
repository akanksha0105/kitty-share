import React, { useState } from "react";
import axios from "axios";
import SendToConnections from "../screens/SendToConnections";
import KeyGeneratedScreen from "../screens/KeyGeneratedScreen";

function ButtonsGroup(props) {
	const { sharedInput, currentDeviceId } = props;

	const [buttonOneDisabled, setButtonOneDisabled] = useState(false);
	const [buttonTwoDisabled, setButtonTwoDisabled] = useState(false);
	const [sendConnectionsComponentEnabled, setConnectionsComponentEnabled] =
		useState(false);
	const [KeyGeneratedComponentEnabled, setKeyGeneratedComponentEnabled] =
		useState(false);
	const [generatedCode, setGeneratedCode] = useState("");

	const generateSecretKey = async () => {
		let valueOfTheURL = sharedInput;
		let senderDeviceId = currentDeviceId;

		console.log("current device id in textinput screen", senderDeviceId);

		console.log("URL entered by the user", valueOfTheURL);
		let secretKeyPromise = axios.post("/api/code/postthevalue", {
			valueOfTheURL,
			senderDeviceId,
		});

		secretKeyPromise
			.then((response) => {
				setGeneratedCode(response.data.data);
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
		console.log("In the sendConnectionsComponentEnabled");
		setButtonOneDisabled(true);
		setButtonTwoDisabled(true);
		setConnectionsComponentEnabled(true);
	};

	const keyGeneratedEnabled = (event) => {
		event.preventDefault();
		generateSecretKey();
		setButtonTwoDisabled(true);
		setKeyGeneratedComponentEnabled(true);
	};

	return (
		<>
			<div className="text__input__screen__buttons">
				<div>
					<button
						onClick={keyGeneratedEnabled}
						className={buttonOneDisabled ? "display-none" : "button__1"}
						type="submit"
						disabled={sharedInput.length > 0 ? false : true}>
						Generate the Key
					</button>
				</div>
				<div>
					<button
						onClick={sendConnectionsEnabled}
						className={buttonTwoDisabled ? "display-none" : "button__2"}
						type="submit"
						disabled={sharedInput.length > 0 ? false : true}>
						Send to Connections
					</button>
				</div>
			</div>

			{sendConnectionsComponentEnabled ? (
				<SendToConnections
					currentDeviceId={currentDeviceId}
					sharedInput={sharedInput}
				/>
			) : null}

			{KeyGeneratedComponentEnabled ? (
				<KeyGeneratedScreen generatedCode={generatedCode} />
			) : null}
		</>
	);
}

export default ButtonsGroup;

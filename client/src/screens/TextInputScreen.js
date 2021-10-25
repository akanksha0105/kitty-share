import React, { useState } from "react";
import { Link } from "react-router-dom";
// import "../styles/styles.css";
import "../styles/TextInputScreen.css";
import { Avatar } from "@material-ui/core";

import axios from "axios";
import KeyGeneratedScreen from "./KeyGeneratedScreen";
import ButtonsGroup from "../components/ButtonsGroup";

function TextInputScreen({ currentDeviceId }) {
	const [isdisabled, setIsDisabled] = useState(false);
	const [sharedInput, setSharedInput] = useState("");
	const [generatedCode, setGeneratedCode] = useState("");
	const [disabledValue, setDisabledValue] = useState(true);

	console.log("In the textInput", currentDeviceId);

	const generateSecretKey = async () => {
		let valueOfTheURL = sharedInput;
		let senderDeviceId = currentDeviceId;

		console.log("current device id in textinput screen", senderDeviceId);

		console.log("URL entered by the user", valueOfTheURL);
		let secretKeyPromise = axios.post(
			"http://localhost:8080/api/code/postthevalue",
			{
				valueOfTheURL,
				senderDeviceId,
			},
		);

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
	const onToggleMoveToTextButton = () => {
		setIsDisabled(!isdisabled);
		setSharedInput("");
		setGeneratedCode("");
	};

	const onMoveToInputKeyScreen = () => {
		setIsDisabled(!isdisabled);
	};

	const onFormSubmit = (event) => {
		event.preventDefault();
		generateSecretKey();
		// setIsDisabled(!isdisabled);
	};

	return (
		<div className="text__input__screen">
			{!isdisabled ? (
				<div className="text__input__form">
					<form onSubmit={onFormSubmit}>
						<label>
							<input
								name="name"
								id="name"
								type="text"
								value={sharedInput}
								onChange={(e) => setSharedInput(e.target.value)}
								required
							/>
							<div className="label-text">Enter the text to be shared</div>
						</label>
						<br />
						<ButtonsGroup
							sharedInput={sharedInput}
							currentDeviceId={currentDeviceId}
						/>
					</form>
				</div>
			) : (
				<KeyGeneratedScreen generatedCode={generatedCode} />
			)}
		</div>
	);
}
export default TextInputScreen;

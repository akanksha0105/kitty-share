import React, { useState } from "react";
import "../styles/TextInputScreen.css";
import { Avatar } from "@material-ui/core";
import CodeInputScreen from "../screens/CodeInputScreen";
import ButtonsGroup from "../components/ButtonsGroup";
import LineSeparator from "../components/LineSeparator";

function TextInputScreen({ currentDeviceId }) {
	const [sharedInput, setSharedInput] = useState("");

	console.log("In the textInput", currentDeviceId);

	return (
		<div className="text__input__screen">
			<CodeInputScreen currentDeviceId={currentDeviceId} />
			<LineSeparator />
			<div className="text__input__form">
				{/* <form onSubmit={onFormSubmit}> */}
				<form>
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
		</div>
	);
}
export default TextInputScreen;

{
	/* <KeyGeneratedScreen generatedCode={generatedCode} /> */
}

// const generateSecretKey = async () => {
// 	let valueOfTheURL = sharedInput;
// 	let senderDeviceId = currentDeviceId;

// 	console.log("current device id in textinput screen", senderDeviceId);

// 	console.log("URL entered by the user", valueOfTheURL);
// 	let secretKeyPromise = axios.post("/api/code/postthevalue", {
// 		valueOfTheURL,
// 		senderDeviceId,
// 	});

// 	secretKeyPromise
// 		.then((response) => {
// 			setGeneratedCode(response.data.data);
// 			console.log("Generated Key provided by the server");
// 		})
// 		.catch((error) => {
// 			const { code } = error.response.data;
// 			if (code === 102) {
// 				return console.error("Code does not exist");
// 			}

// 			console.error("Unable to generate code");
// 		});
// };
// const onToggleMoveToTextButton = () => {
// 	setIsDisabled(!isdisabled);
// 	setSharedInput("");
// 	setGeneratedCode("");
// };

// const onFormSubmit = (event) => {
// 	event.preventDefault();
// 	generateSecretKey();
// 	// setIsDisabled(!isdisabled);
// };

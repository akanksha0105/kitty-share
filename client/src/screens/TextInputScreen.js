import React, { useState } from "react";
import { Link } from "react-router-dom";
// import "../styles/styles.css";
import "../styles/TextInputScreen.css";
import { Avatar } from "@material-ui/core";

import axios from "axios";
import KeyGeneratedScreen from "./KeyGeneratedScreen";

function TextInputScreen({ currentDeviceId }) {
	const [isdisabled, setIsDisabled] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [generatedCode, setGeneratedCode] = useState("");
	const [disabledValue, setDisabledValue] = useState(true);

	console.log("In the textInput", currentDeviceId);

	const generateSecretKey = async () => {
		let valueOfTheURL = searchInput;
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
		setSearchInput("");
		setGeneratedCode("");
	};

	const onMoveToInputKeyScreen = () => {
		setIsDisabled(!isdisabled);
	};

	const onFormSubmit = (event) => {
		event.preventDefault();
		generateSecretKey();
		setIsDisabled(!isdisabled);
	};

	return (
		<div className="text__input__screen">
			{!isdisabled ? (
				<div className="text__input__form">
					<form onSubmit={onFormSubmit}>
						{/* 
						{currentDeviceId ? (
							<>
								{" "}
								<div>
									<Avatar
										alt="Remy Sharp"
										src={`https://avatars.dicebear.com/api/human/${currentDeviceId}.svg`}
									/>{" "}
								</div>{" "}
							</>
						) : null} */}

						<label>
							<input
								name="name"
								id="name"
								type="text"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								required
							/>
							<div className="label-text">Enter the text to be shared</div>
						</label>
						<br />
						{/* <div className="text__input__screen__buttons"> */}
						<div>
							<button
								className="button__1"
								type="submit"
								disabled={searchInput.length > 0 ? false : true}>
								Generate the Key
							</button>
						</div>
						<div>
							<Link
								to={{
									pathname: "/sendtoconnections",
									state: {
										url: { searchInput },
										currentDeviceId: { currentDeviceId },
									},
								}}>
								{" "}
								<button
									className="button__2"
									disabled={searchInput.length > 0 ? false : true}>
									Send to Connections
								</button>
							</Link>
						</div>
						{/* </div> */}
					</form>
				</div>
			) : (
				<KeyGeneratedScreen generatedCode={generatedCode} />
			)}
		</div>
	);
}
export default TextInputScreen;

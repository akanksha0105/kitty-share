import React, { useState } from "react";
import "../styles/TextInputScreen.css";
import "../styles/HomeScreen.css";
import CodeInput from "../components/CodeInput";
import ButtonsGroup from "../components/ButtonsGroup";
import LineSeparator from "../components/LineSeparator";

function HomeScreen({
	currentDeviceId,
	currentDeviceName,
	isDeviceSubscribed,
}) {
	const [sharedInput, setSharedInput] = useState("");
	const [showTextInput, setShowTextInput] = useState(true);

	const displayTextInputComponent = () => {
		console.log("In displayTextInputComponent");
		setShowTextInput(false);
	};

	const displayErrorMessage = () => {
		setSharedInput("Please enter the text...");
	};
	console.log(
		"In the HomeSreenComponent with the currentDeviceId : ",
		currentDeviceId,
	);

	return (
		<div className="home__screen">
			<div className="home">
				<CodeInput
					displayTextInputComponent={displayTextInputComponent}
					currentDeviceId={currentDeviceId}
					showTextInput={showTextInput}
				/>
				<LineSeparator showTextInput={showTextInput} />
				<div className={showTextInput ? "text__input__form" : "display-none"}>
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
							currentDeviceName={currentDeviceName}
							isDeviceSubscribed={isDeviceSubscribed}
							displayErrorMessage={displayErrorMessage}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
export default HomeScreen;

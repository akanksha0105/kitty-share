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
	const [showCodeInput, setShowCodeInput] = useState(true);
	const displayTextInputComponent = () => {
		setShowTextInput(false);
	};

	const displayCodeInputComponent = () => {
		setShowCodeInput(false);
	};

	const displayErrorMessage = () => {
		setSharedInput("Please enter the text...");
	};

	const getTextInputScreenName = () => {
		if (showTextInput === true && showCodeInput === false) {
			return "alternative__text__input__form";
		} else if (showTextInput === false && showCodeInput === true) {
			return "display-none";
		} else if (showTextInput === true && showCodeInput === true) {
			return "text__input__form";
		}
	};
	return (
		<div className='home__screen'>
			<div className='home'>
				<CodeInput
					displayTextInputComponent={displayTextInputComponent}
					currentDeviceId={currentDeviceId}
					showTextInput={showTextInput}
					showCodeInput={showCodeInput}
				/>
				<LineSeparator
					showTextInput={showTextInput}
					showCodeInput={showCodeInput}
				/>
				{/* <div className={showTextInput ? "text__input__form" : "display-none"}> */}
				<div className={getTextInputScreenName()}>
					<form className='form__one__div'>
						<label>
							<input
								name='name'
								id='name'
								type='text'
								value={sharedInput}
								onChange={(e) => setSharedInput(e.target.value)}
								required
							/>
							<div className='label-text'>Enter the text to be shared</div>
						</label>
						{/* <br /> */}
						<ButtonsGroup
							sharedInput={sharedInput}
							currentDeviceId={currentDeviceId}
							currentDeviceName={currentDeviceName}
							isDeviceSubscribed={isDeviceSubscribed}
							displayErrorMessage={displayErrorMessage}
							displayCodeInputComponent={displayCodeInputComponent}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
export default HomeScreen;

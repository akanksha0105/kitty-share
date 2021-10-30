import React, { useState } from "react";
import "../styles/TextInputScreen.css";

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

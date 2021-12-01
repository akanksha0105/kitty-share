import React, { useState } from "react";
import "../styles/TextInputScreen.css";

import CodeInput from "../components/CodeInput";
import ButtonsGroup from "../components/ButtonsGroup";
import LineSeparator from "../components/LineSeparator";

function HomeScreen({ currentDeviceId, currentDeviceName }) {
	const [sharedInput, setSharedInput] = useState("");

	console.log(
		"In the HomeSreenComponent with the currentDeviceId : ",
		currentDeviceId,
	);

	return (
		<div className="home__screen">
			<CodeInput currentDeviceId={currentDeviceId} />
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
						currentDeviceName={currentDeviceName}
					/>
				</form>
			</div>
		</div>
	);
}
export default HomeScreen;

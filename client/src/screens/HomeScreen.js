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

	console.log(
		"In the HomeSreenComponent with the currentDeviceId : ",
		currentDeviceId,
	);

	return (
		<div className="home__screen">
			<div className="home">
				<CodeInput currentDeviceId={currentDeviceId} />
				<LineSeparator />
				<div className="text__input__form">
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
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
export default HomeScreen;

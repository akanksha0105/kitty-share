import React, { useState } from "react";
import { Link } from "react-router-dom";
import SendToConnections from "../screens/SendToConnections";

function ButtonsGroup(props) {
	const { sharedInput, currentDeviceId } = props;

	const [buttonsGroupDisabled, setButtonsGroupDisabled] = useState(false);
	const [sendConnectionsComponentEnabled, setConnectionsComponentEnabled] =
		useState(false);

	const sendConnectionsEnabled = () => {
		console.log("In the sendConnectionsComponentEnabled");
		setButtonsGroupDisabled(true);
		setConnectionsComponentEnabled(true);
	};

	return (
		<>
			<div
				className={
					buttonsGroupDisabled ? "display-none" : "text__input__screen__buttons"
				}>
				<div>
					<button
						className="button__1"
						type="submit"
						disabled={sharedInput.length > 0 ? false : true}>
						Generate the Key
					</button>
				</div>
				<div>
					<button
						onClick={sendConnectionsEnabled}
						className="button__2"
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
		</>
	);
}

export default ButtonsGroup;

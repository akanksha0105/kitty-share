import React, { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { linkDevices } from "../functions/functions";

function LinkToDeviceScreen({ currentDeviceId }) {
	const [receiverDeviceID, setReceiverDeviceID] = useState("");
	const [linkDeviceButtonText, setLinkDeviceButtonText] = useState("Link");
	const [isLinkDeviceButtonDisabled, setIsLinkDeviceButtonDisabled] =
		useState(true);

	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const onLinkToNewDevice = async () => {
		setErrorMessage("");
		setSuccessMessage("");
		console.log(
			"In onSendingToOtherDevice event handler in LinkToDeviceScreen component",
		);

		setIsLinkDeviceButtonDisabled(true);
		setLinkDeviceButtonText("Linking...");

		if (currentDeviceId.localeCompare(receiverDeviceID) === 0) {
			setErrorMessage("Sender device cannot be same as Receiver Device");
			setIsLinkDeviceButtonDisabled(false);
			setLinkDeviceButtonText("Link Again");
			return;
		}

		linkDevices(currentDeviceId, receiverDeviceID)
			.then((linkDevicesResponse) => {
				console.log("linkDevicesResponse", linkDevicesResponse);
				if (linkDevicesResponse.linked === true) {
					setSuccessMessage("Both devices are linked");
					setIsLinkDeviceButtonDisabled(false);
					setLinkDeviceButtonText("Link Again");
					return;
				}

				setErrorMessage(linkDevicesResponse.message);
				setIsLinkDeviceButtonDisabled(false);
				setLinkDeviceButtonText("Link Again");
			})
			.catch((err) => {
				console.error("Unable to link both the devices", err);
				setErrorMessage("Unable to link both the devices");
			});
	};

	useEffect(() => {
		console.log("receiverDeviceId", receiverDeviceID);

		if (receiverDeviceID.length > 0) {
			setIsLinkDeviceButtonDisabled(false);
		} else {
			setIsLinkDeviceButtonDisabled(true);
		}
	}, [receiverDeviceID]);

	if (currentDeviceId === "" || undefined) return <div>Loading device...</div>;

	return (
		<div className="link__to__a__device__screen">
			<form>
				<div>
					<label>
						<input
							id="receiver_device_id"
							type="text"
							value={receiverDeviceID}
							onChange={(e) => setReceiverDeviceID(e.target.value)}
							required
						/>
						<div className="label-text">Enter the Device Id</div>
					</label>
				</div>

				<button
					className="button__1"
					type="button"
					disabled={isLinkDeviceButtonDisabled}
					onClick={onLinkToNewDevice}>
					{linkDeviceButtonText}
				</button>

				{errorMessage ? <ErrorMessage message={errorMessage} /> : null}
				{successMessage ? <SuccessMessage message={successMessage} /> : null}
			</form>

			<div></div>
		</div>
	);
}

export default LinkToDeviceScreen;

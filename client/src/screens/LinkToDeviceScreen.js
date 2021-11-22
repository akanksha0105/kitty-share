import React, { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { linkDevices } from "../functions/functions";
import { checkReceiverDeviceName } from "../functions/codeInputScreenFunctions";

function LinkToDeviceScreen({ currentDeviceId }) {
	const [receiverDeviceID, setReceiverDeviceID] = useState("");
	const [linkDeviceButtonText, setLinkDeviceButtonText] = useState("Link");
	const [isLinkDeviceButtonDisabled, setIsLinkDeviceButtonDisabled] =
		useState(true);
	const [receiverDeviceName, setReceiverDeviceName] = useState("");
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

		checkReceiverDeviceName(receiverDeviceName)
			.then((getReceiverDeviceNameResponse) => {
				console.log(
					"getReceiverDeviceNameResponse",
					getReceiverDeviceNameResponse,
				);
				if (getReceiverDeviceNameResponse.retrievedDeviceId === false) {
					setErrorMessage(getReceiverDeviceNameResponse.message);
					setIsLinkDeviceButtonDisabled(false);
					setLinkDeviceButtonText("Link Again");
					return;
				}

				setReceiverDeviceID(getReceiverDeviceNameResponse.receiverDeviceId);
				return checkTwoDevicesCanBeLinked(
					getReceiverDeviceNameResponse.receiverDeviceId,
				);
			})
			// .then((x) => {
			// 	if (currentDeviceId.localeCompare(receiverDeviceID) === 0) {
			// 		setErrorMessage("Sender device cannot be same as Receiver Device");
			// 		setIsLinkDeviceButtonDisabled(false);
			// 		setLinkDeviceButtonText("Link Again");
			// 		return;
			// 	}

			// 	linkDevices(currentDeviceId, receiverDeviceID)
			// 		.then((linkDevicesResponse) => {
			// 			console.log("linkDevicesResponse", linkDevicesResponse);
			// 			if (linkDevicesResponse.linked === true) {
			// 				setSuccessMessage("Both devices are linked");
			// 				setIsLinkDeviceButtonDisabled(false);
			// 				setLinkDeviceButtonText("Link Again");
			// 				return true;
			// 			}

			// 			setErrorMessage(linkDevicesResponse.message);
			// 			setIsLinkDeviceButtonDisabled(false);
			// 			setLinkDeviceButtonText("Link Again");
			// 			return;
			// 		})

			.catch((err) => {
				console.error("Unable to link both the devices", err);
				setErrorMessage("Unable to link both the devices");
			});
	};

	const checkTwoDevicesCanBeLinked = (receiverDeviceId) => {
		if (currentDeviceId.localeCompare(receiverDeviceId) === 0) {
			setErrorMessage("Sender device cannot be same as Receiver Device");
			setIsLinkDeviceButtonDisabled(false);
			setLinkDeviceButtonText("Link Again");
			return;
		}

		linkDevices(currentDeviceId, receiverDeviceId).then(
			(linkDevicesResponse) => {
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
				return;
			},
		);
	};

	useEffect(() => {
		console.log("receiverDeviceId", receiverDeviceID);

		if (receiverDeviceName.length > 0) {
			setIsLinkDeviceButtonDisabled(false);
		} else {
			setIsLinkDeviceButtonDisabled(true);
		}
	}, [receiverDeviceName]);

	if (currentDeviceId === "" || undefined) return <div>Loading device...</div>;

	return (
		<div className="link__to__a__device__screen">
			<form>
				<div>
					<label>
						<input
							id="receiver_device_id"
							type="text"
							value={receiverDeviceName}
							onChange={(e) => setReceiverDeviceName(e.target.value)}
							required
						/>

						{/* <input
							id="receiver_device_id"
							type="text"
							value={receiverDeviceID}
							onChange={(e) => setReceiverDeviceID(e.target.value)}
							required
						/> */}
						<div className="label-text">Enter the Device Name</div>
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

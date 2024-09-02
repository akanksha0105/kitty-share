import React, { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import { linkDevices, LinkDevicesResponseType } from "../functions/functions";
import { checkReceiverDeviceName, getRecieverDeviceDetails } from "../functions/codeInputScreenFunctions";
import "../styles/LinkToDevice.css";

interface LinkToDeviceScreenProps {
	currentDeviceId: string,
}
const LinkToDeviceScreen: React.FC<LinkToDeviceScreenProps> = ({ currentDeviceId }) => {
	const [receiverDeviceID, setReceiverDeviceID] = useState("");
	const [linkDeviceButtonText, setLinkDeviceButtonText] = useState("Link");
	const [isLinkDeviceButtonDisabled, setIsLinkDeviceButtonDisabled] =
		useState(true);
	const [receiverDeviceName, setReceiverDeviceName] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const onLinkToNewDevice = async (): Promise<void> => {

		try {
			setErrorMessage("");
			setSuccessMessage("");
			setIsLinkDeviceButtonDisabled(true);
			setLinkDeviceButtonText("Linking...");

			const getReceiverDeviceNameResponse: getRecieverDeviceDetails = await checkReceiverDeviceName(receiverDeviceName);

			if (getReceiverDeviceNameResponse.retrievedDeviceId === false) {
				setErrorMessage(getReceiverDeviceNameResponse.message);
				setIsLinkDeviceButtonDisabled(false);
				setLinkDeviceButtonText("Link Again");
				return;
			}

			setReceiverDeviceID(getReceiverDeviceNameResponse.receiverDeviceId ?? "");

			return checkTwoDevicesCanBeLinked(
				getReceiverDeviceNameResponse.receiverDeviceId ?? ""
			);


		} catch (error) {
			console.error("Unable to link both the devices", error);
			setErrorMessage("Unable to link both the devices");
		}

	};

	const checkTwoDevicesCanBeLinked = async (receiverDeviceId: string) => {

		try {
			if (currentDeviceId.localeCompare(receiverDeviceId) === 0) {
				setErrorMessage("Sender device cannot be same as Receiver Device");
				setIsLinkDeviceButtonDisabled(false);
				setLinkDeviceButtonText("Link Again");
				return;
			}

			const linkDevicesResponse: LinkDevicesResponseType = await linkDevices(currentDeviceId, receiverDeviceId);

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

		} catch (error) {
			console.error(error);
			return;
		}
	};

	useEffect(() => {


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
};

export default LinkToDeviceScreen;

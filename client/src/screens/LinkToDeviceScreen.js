import React, { useState } from "react";
import Message from "../components/Message";
import { linkDevices } from "../functions/functions";

function LinkToDeviceScreen({ currentDeviceId }) {
	const [receiverDeviceID, setReceiverDeviceID] = useState("");
	const [message, setMessage] = useState("");

	const onLinkToNewDevice = async () => {
		console.log(
			"In onSendingToOtherDevice event handler in LinkToDeviceScreen component",
		);

		if (currentDeviceId.localeCompare(receiverDeviceID) === 0) {
			setMessage("Sender device cannot be same as Receiver Device");
			return;
		}

		linkDevices(currentDeviceId, receiverDeviceID)
			.then((linkDevicesResponse) => {
				console.log("linkDevicesResponse", linkDevicesResponse);
				if (linkDevicesResponse.linked === true) {
					setMessage("Both devices are linked");
					return;
				}

				setMessage(linkDevicesResponse.message);
			})
			.catch((err) => {
				console.error("Unable to link both the devices", err);
				setMessage("Unable to link both the devices");
			});
	};

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
					disabled={receiverDeviceID.length > 0 ? false : true}
					onClick={onLinkToNewDevice}>
					Link
				</button>

				{message ? <Message message={message} /> : null}
			</form>

			<div></div>
		</div>
	);
}

export default LinkToDeviceScreen;

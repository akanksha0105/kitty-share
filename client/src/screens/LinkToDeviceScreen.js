import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Message from "../components/Message";
import {
	checkReceiverDeviceIsSubscribed,
	addReceiverToTheDeviceConnectionList,
} from "../functions/functions";

//import './styles.css';

function LinkToDeviceScreen() {
	const location = useLocation();
	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const [receiverDeviceID, setReceiverDeviceID] = useState("");
	const [message, setMessage] = useState("");

	const onLinkToNewDevice = async () => {
		console.log(
			"In onSendingToOtherDevice event handler in LinkToDeviceScreen component",
		);

		checkReceiverDeviceIsSubscribed(receiverDeviceID)
			.then((checkReceiverDeviceIsSubscribedResponse) => {
				console.log(
					"response in checkReceiverDeviceIsSubscribed",
					checkReceiverDeviceIsSubscribedResponse,
				);
				if (checkReceiverDeviceIsSubscribedResponse.isSubscribed === false) {
					return checkReceiverDeviceIsSubscribedResponse.message;
				}
				return addReceiverToTheDeviceConnectionList(
					currentDeviceId,
					receiverDeviceID,
				);
			})
			.then((linkedToADeviceResponse) => {
				console.log("linkedToADeviceResponse", linkedToADeviceResponse);
				setMessage(linkedToADeviceResponse);
			})
			.catch((err) => {
				console.error("Unable to link to a new device", err);
				setMessage("Unable to link to a new device");
			});
	};

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

				{receiverDeviceID.length > 0 ? (
					<button type="button" onClick={onLinkToNewDevice}>
						Link
					</button>
				) : null}

				{message ? <Message message={message} /> : null}
			</form>

			<div></div>
		</div>
	);
}

export default LinkToDeviceScreen;

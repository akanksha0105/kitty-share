import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
//import './styles.css';

function LinkToDeviceScreen() {
	const location = useLocation();
	const urlTobeShared = location.state?.url;
	const currentDeviceId = location.state?.currentDeviceId;
	const [receiverDeviceID, setReceiverDeviceID] = useState('');

	//User enters the device_id of the other device to send the URL
	const onSendingToOtherDevice = () => {
		//check whether the entered device_id is valid or not
		console.log("Receiver's device id", receiverDeviceID);

		const deviceIdToBeChecked = receiverDeviceID;
		axios
			.post('http://localhost:8080/api/devices/deviceidvalid', {
				deviceIdToBeChecked,
			})
			.then((deviceIdValidConfirmation) => {
				console.log('Device id valid confirmation', deviceIdValidConfirmation);
				//For valid device_id
				//send the notification to the receiver's device
				sendNotificationToTheServer();
				//For invalid device_D
			})
			.catch((err) => {
				console.error(
					'Error encountered during the checking of device_id',
					err,
				);
			});

		//send the URL if the device_id is valid
	};

	const sendNotificationToTheServer = async () => {
		return await axios
			.post('http://localhost:8080/api/subscription/sendnotification', {
				currentDeviceId,
				receiverDeviceID,
				urlTobeShared,
			})
			.then((res) => {
				console.log('URL is shared with the receiver', res);
			})
			.catch((err) =>
				console.error('Error in sending URL to the user.. ', err),
			);
	};
	return (
		<div className='link__to__a__device__screen'>
			<form>
				<div>
					<label>
						<input
							type='text'
							value={receiverDeviceID}
							onChange={(e) => setReceiverDeviceID(e.target.value)}
						/>
						<div className='label-text'>Enter the Device Id</div>
					</label>
				</div>

				<button type='button' onClick={onSendingToOtherDevice}>
					Send
				</button>
			</form>
		</div>
	);
}

export default LinkToDeviceScreen;

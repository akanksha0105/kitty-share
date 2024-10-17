import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import LinkToDeviceScreen from "./screens/LinkToDeviceScreen";
import axios from "axios";
import Header from "./components/Header";
import Loading from "./components/Loading";
import HomeScreen from "./screens/HomeScreen";
import ShowMessage from "./screens/ShowMessage";
import WebsiteLoader from "./screens/WebsiteLoader";
import Demo from "./screens/Demo";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import "./styles/App.css";
import { baseURL } from "./helper";
function App() {
	const [currentDeviceId, setCurrentDeviceId] = useState("");
	const [currentDeviceName, setCurrentDeviceName] = useState("");
	const [isSubscribedToNotifications, setIsSubscribedToNotifications] =
		useState(false);
	const [isSubscribeButtonDisabled, setIsSubscribeButtonDisabled] =
		useState(false);
	const checkDeviceSubscribedToNotifications = () => {
		let isSubscribed = JSON.parse(localStorage.getItem("isSubscribed"));

		if (isSubscribed === null) {
			localStorage.setItem("isSubscribed", false);
			setIsSubscribedToNotifications(false);
			return;
		}

		if (isSubscribed === true) {
			localStorage.setItem("isSubscribed", true);
			setIsSubscribedToNotifications(true);
			setIsSubscribeButtonDisabled(true);
			return;
		}

		if (isSubscribed === false) {
			localStorage.setItem("isSubscribed", false);
			setIsSubscribedToNotifications(false);
			setIsSubscribeButtonDisabled(false);
			return;
		}
	};
	const registerANewDevice = async () => {
		let fetchedDeviceId = localStorage.getItem("deviceId");

		if (fetchedDeviceId == null) {
			let newDeviceIdGenerated = uuidv4();
			localStorage.setItem("deviceId", newDeviceIdGenerated);
			let senderDeviceId = localStorage.getItem("deviceId");
			return await axios
				.post(`${baseURL}/api/devices/newdevice`, {
					senderDeviceId,
				})
				.then((response) => {
					localStorage.setItem("device saved", true);

					return generateNewDeviceName(response.data.deviceId);
				})
				.catch((err) => {
					console.error("new device not stored in database", err);
					return null;
				});
		} else {
			setCurrentDeviceId(localStorage.getItem("deviceId"));
			return generateNewDeviceName(localStorage.getItem("deviceId"));
		}
	};

	const generateNewDeviceName = async (idOfCurrentDevice) => {
		let deviceId = idOfCurrentDevice;

		if (localStorage.getItem("deviceName") !== null) {
			setCurrentDeviceName(localStorage.getItem("deviceName"));
			return;
		}

		return axios
			.post(`${baseURL}/api/devices/newdevice/devicename/${deviceId}`)
			.then((generateNewDeviceNameResponse) => {
				if (generateNewDeviceNameResponse.data.updatedDeviceName === true) {
					localStorage.setItem(
						"deviceName",
						generateNewDeviceNameResponse.data.deviceName,
					);

					setCurrentDeviceName(generateNewDeviceNameResponse.data.devicName);
					setCurrentDeviceId(deviceId);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const onNotificationsPermission = () => {
		let isSubscribed = isSubscribedToNotifications;

		if (isSubscribed === false) {
			serviceWorkerRegistration
				.subscribeToPushNotifications()
				.then((response) => {
					if (response === true) {
						localStorage.setItem("isSubscribed", true);
						setIsSubscribedToNotifications(true);
						setIsSubscribeButtonDisabled(true);
					} else {
						localStorage.setItem("isSubscribed", false);
						setIsSubscribedToNotifications(false);
						setIsSubscribeButtonDisabled(false);
					}
				})
				.catch((err) => {
					console.error(
						"Application not registered for the push notifications",
						err,
					);
					localStorage.setItem("isSubscribed", false);
					setIsSubscribedToNotifications(false);
					setIsSubscribeButtonDisabled(false);
					// setSubscribeOptionButtonText("Subscribe");
				});
			return;
		}

		if (isSubscribed === true) {
			// localStorage.setItem("isSubscribed", false);
			// setIsSubscribedToNotifications(false);
			setIsSubscribeButtonDisabled(true);
			// setSubscribeOptionButtonText("Subscribe");
			// setOpenUnSubscriptionModal(true);

			return;
		}
	};

	useEffect(() => {
		registerANewDevice();
	}, [currentDeviceId, currentDeviceName]);

	useEffect(() => {
		checkDeviceSubscribedToNotifications();
	});

	if (currentDeviceId === "") return <WebsiteLoader />;

	return (
		<div className='app'>
			<Router>
				<Header
					currentDeviceId={currentDeviceId}
					currentDeviceName={currentDeviceName}
					isDeviceSubscribed={isSubscribedToNotifications}
					onNotificationsPermission={onNotificationsPermission}
					isSubscribeButtonDisabled={isSubscribeButtonDisabled}
				/>
				{currentDeviceId ? (
					<Switch>
						<Route path='/linktoanewdevice'>
							<LinkToDeviceScreen currentDeviceId={currentDeviceId} />
						</Route>
						<Route path='/loading'>
							<Loading />
						</Route>
						<Route path='/demo'>
							<Demo />
						</Route>
						<Route path='/showmessage'>
							<ShowMessage />
						</Route>
						<Route path='/'>
							<HomeScreen
								currentDeviceId={currentDeviceId}
								currentDeviceName={currentDeviceName}
								isDeviceSubscribed={isSubscribedToNotifications}
							/>
						</Route>
					</Switch>
				) : null}
			</Router>
		</div>
	);
}

export default App;

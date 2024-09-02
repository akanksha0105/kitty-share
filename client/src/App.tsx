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

const App = () => {

	const [currentDeviceId, setCurrentDeviceId] = useState("");
	const [currentDeviceName, setCurrentDeviceName] = useState("");
	const [isSubscribedToNotifications, setIsSubscribedToNotifications] = useState(false);


	const checkDeviceSubscribedToNotifications = () => {
		let isSubscribed: boolean = JSON.parse(localStorage.getItem("isSubscribed") || "false");
		localStorage.setItem("isSubscribed", JSON.stringify(isSubscribed));
		setIsSubscribedToNotifications(isSubscribed);
	};



	const registerANewDevice = async () => {
		let fetchedDeviceId = localStorage.getItem("deviceId");

		if (fetchedDeviceId == null) {
			let newDeviceIdGenerated = uuidv4();
			localStorage.setItem("deviceId", newDeviceIdGenerated);
			let senderDeviceId = localStorage.getItem("deviceId");
			return await axios
				.post("/api/devices/newdevice", {
					senderDeviceId,
				})
				.then((response) => {
					console.log(" new device saved in database ", response);
					localStorage.setItem("device saved", JSON.stringify(true));

					return generateNewDeviceName(response.data.deviceId);
				})
				.catch((err) => {
					console.error("new device not stored in database", err);
					return null;
				});
		} else {
			const deviceId = localStorage.getItem("deviceId") ?? "";
			setCurrentDeviceId(deviceId);
			return generateNewDeviceName(deviceId);
			// return fetchedDeviceId;
		}
	};

	const generateNewDeviceName = async (idOfCurrentDevice: string) => {
		let deviceId = idOfCurrentDevice;
		console.log(
			"In generateNewDeviceName in App component with currentDeviceId :",
			deviceId,
		);

		const deviceName = localStorage.getItem("deviceName") ?? "";
		if (deviceName?.length > 0) {
			setCurrentDeviceName(deviceName);
			return;
		}

		return axios
			.post(`/api/devices/newdevice/devicename/${deviceId}`)
			.then((generateNewDeviceNameResponse) => {
				console.log(
					"generateNewDeviceNameResponse",
					generateNewDeviceNameResponse,
				);

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
		console.log("isSubscribed in onNotificationsPermission", isSubscribed);
		if (isSubscribed === false) {
			console.log(
				"isSubscribed in  Loop1 onNotificationsPermission",
				isSubscribed,
			);
			serviceWorkerRegistration
				.subscribeToPushNotifications()
				.then((response) => {
					console.log("subscribed to push notifications", response);

					if (response === true) {
						console.log("Here");
						localStorage.setItem("isSubscribed", JSON.stringify(true));
						setIsSubscribedToNotifications(true);
					} else {
						console.log("Here2");
						localStorage.setItem("isSubscribed", JSON.stringify(false));
						setIsSubscribedToNotifications(false);
					}
				})
				.catch((err) => {
					console.error(
						"Application not registered for the push notifications",
						err,
					);
					localStorage.setItem("isSubscribed", JSON.stringify(false));
					setIsSubscribedToNotifications(false);
				});
			return;
		}

		if (isSubscribed === true) {
			console.log(
				"isSubscribed in  Loop2 onNotificationsPermission",
				isSubscribed,
			);
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
		<div className="app">
			<Router>
				<Header
					currentDeviceId={currentDeviceId}
					currentDeviceName={currentDeviceName}
					isDeviceSubscribed={isSubscribedToNotifications}
					onNotificationsPermission={onNotificationsPermission}
					isSubscribeButtonDisabled={isSubscribedToNotifications}
				/>
				{currentDeviceId ? (
					<Switch>
						<Route path="/linktoanewdevice">
							<LinkToDeviceScreen currentDeviceId={currentDeviceId} />
						</Route>
						<Route path="/loading">
							<Loading />
						</Route>
						<Route path="/demo">
							<Demo />
						</Route>
						<Route path="/showmessage">
							<ShowMessage />
						</Route>
						<Route path="/">
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
};

export default App;

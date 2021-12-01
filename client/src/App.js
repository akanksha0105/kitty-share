import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import LinkToDeviceScreen from "./screens/LinkToDeviceScreen";
import axios from "axios";
import Header from "./components/Header";
import Loading from "./components/Loading";
import HomeScreen from "./screens/HomeScreen";

function App() {
	const [currentDeviceId, setCurrentDeviceId] = useState("");
	const [currentDeviceName, setCurrentDeviceName] = useState("");

	const registerANewDevice = async () => {
		let fetchedDeviceId = localStorage.getItem("deviceId");

		if (fetchedDeviceId == null) {
			let newDeviceIdGenerated = uuidv4();
			localStorage.setItem("deviceId", newDeviceIdGenerated);
			let senderDeviceId = localStorage.getItem("deviceId");
			return await axios
				.post("http://localhost:8080/api/devices/newdevice", {
					senderDeviceId,
				})
				.then((response) => {
					console.log(" new device saved in database ", response);

					// setCurrentDeviceId(response.data.deviceId);
					// return response.data.deviceId;
					return generateNewDeviceName(response.data.deviceId);
				})
				.catch((err) => {
					console.error("new device not stored in database", err);
					return null;
				});
		} else {
			setCurrentDeviceId(localStorage.getItem("deviceId"));
			return generateNewDeviceName(localStorage.getItem("deviceId"));
			// return fetchedDeviceId;
		}
	};

	const generateNewDeviceName = async (idOfCurrentDevice) => {
		let deviceId = idOfCurrentDevice;
		console.log(
			"In generateNewDeviceName in App component with currentDeviceId :",
			deviceId,
		);

		if (localStorage.getItem("deviceName") !== null) {
			setCurrentDeviceName(localStorage.getItem("deviceName"));
			return;
		}

		return axios
			.post(
				`http://localhost:8080/api/devices/newdevice/devicename/${deviceId}`,
			)
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
	useEffect(() => {
		registerANewDevice();
	}, [currentDeviceId, currentDeviceName]);

	if (currentDeviceId === "") return <Loading />;

	return (
		<div className="app">
			<Router>
				<Header
					currentDeviceId={currentDeviceId}
					currentDeviceName={currentDeviceName}
				/>
				{currentDeviceId ? (
					<Switch>
						<Route path="/linktoanewdevice">
							<LinkToDeviceScreen currentDeviceId={currentDeviceId} />
						</Route>
						<Route path="/loading">
							<Loading />
						</Route>

						<Route path="/">
							<HomeScreen
								currentDeviceId={currentDeviceId}
								currentDeviceName={currentDeviceName}
							/>
						</Route>
					</Switch>
				) : null}
			</Router>
		</div>
	);
}

export default App;

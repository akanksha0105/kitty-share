import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import HomeScreen from "./screens/HomeScreen";
import CodeInputScreen from "./screens/CodeInputScreen";
import TextInputScreen from "./screens/TextInputScreen";
import LinkToDeviceScreen from "./screens/LinkToDeviceScreen";
import axios from "axios";
import SendToConnections from "./screens/SendToConnections";
import Message from "./Message";

function App() {
	const [currentDeviceId, setCurrentDeviceId] = useState("");
	const checkOrAttachDeviceId = async () => {
		let fetchedDeviceId = localStorage.getItem("deviceId");
		//Case 1: If localStorage does not have deviceId

		if (fetchedDeviceId == null) {
			let newDeviceIdGenerated = uuidv4();
			localStorage.setItem("deviceId", newDeviceIdGenerated);
			let senderDeviceId = localStorage.getItem("deviceId");
			axios
				.post("http://localhost:8080/api/devices/newdevice", {
					senderDeviceId,
				})
				.then((response) => {
					console.log(" new device saved in database ", response.data.deviceId);

					setCurrentDeviceId(response.data.deviceId);

					//Call for the subscription object to save the address(endpoint) of the device
				})
				.catch((err) => {
					console.error("new device not stored in database", err);
				});
		} else {
			setCurrentDeviceId(localStorage.getItem("deviceId"));
		}
	};

	useEffect(() => {
		checkOrAttachDeviceId();
		console.log("currentDeviceId", currentDeviceId);
	});

	return (
		<div className="app">
			<Router>
				<Switch>
					<Route path="/code">
						<CodeInputScreen currentDeviceId={currentDeviceId} />
					</Route>
					<Route path="/text">
						<TextInputScreen currentDeviceId={currentDeviceId} />
					</Route>
					<Route path="/linktoanewdevice">
						<LinkToDeviceScreen />
					</Route>
					<Route path="/success">
						<Message />
					</Route>
					<Route path="/sendtoconnections">
						<SendToConnections />
					</Route>

					<Route path="/">
						<HomeScreen />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;

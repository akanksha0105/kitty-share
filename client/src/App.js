import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TextInputScreen from "./screens/TextInputScreen";
import LinkToDeviceScreen from "./screens/LinkToDeviceScreen";
import axios from "axios";
import Header from "./components/Header";
import Loading from "./components/Loading";

function App() {
	const [currentDeviceId, setCurrentDeviceId] = useState("");
	const checkOrAttachDeviceId = async () => {
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
					console.log(" new device saved in database ", response.data.deviceId);

					setCurrentDeviceId(response.data.deviceId);
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
	}, []);

	if (currentDeviceId === "") return <Loading />;

	return (
		<div className="app">
			<Router>
				<Header currentDeviceId={currentDeviceId} />
				{currentDeviceId ? (
					<Switch>
						<Route path="/linktoanewdevice">
							<LinkToDeviceScreen currentDeviceId={currentDeviceId} />
						</Route>
						<Route path="/loading">
							<Loading />
						</Route>
						<Route PATH="/">
							<TextInputScreen currentDeviceId={currentDeviceId} />
						</Route>
					</Switch>
				) : null}
			</Router>
		</div>
	);
}

export default App;

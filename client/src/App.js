import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TextInputScreen from "./screens/TextInputScreen";
import LinkToDeviceScreen from "./screens/LinkToDeviceScreen";
import axios from "axios";
import Header from "./components/Header";
import Loading from "./components/Loading";
import PotentialConnections from "./screens/PotentialConnections";
import nounsArray from "./jsonFiles/nouns.json";
import adjectivesArray from "./jsonFiles/adjectives.json";

function App() {
	const [currentDeviceId, setCurrentDeviceId] = useState("");
	const [currentDeviceName, setCurrentDeviceName] = useState("");

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
					return response.data.deviceId;
				})
				.catch((err) => {
					console.error("new device not stored in database", err);
					return null;
				});
		} else {
			setCurrentDeviceId(localStorage.getItem("deviceId"));
			return fetchedDeviceId;
		}
	};

	const generateDeviceName = async (checkOrAttachDeviceIdResponse) => {
		// let nounsArray = JSON.parse(nouns);
		let flag = false;
		console.log(
			nounsArray[0].nouns.length,
			adjectivesArray[0].adjectives.length,
		);
		for (let i = 0; i < nounsArray[0].nouns.length; i++) {
			for (let j = 0; j < adjectivesArray[0].adjectives.length; j++) {
				// console.log(`i is ${i} and j is ${j}`);
				let generatedDeviceName =
					nounsArray[0].nouns[i] + " " + adjectivesArray[0].adjectives[j];
				console.log(
					"The generated device name of device is: ",
					generatedDeviceName,
				);

				let result = await checkIfDeviceNameExists(generatedDeviceName);
				flag = result;
				// console.log(`Flag here : ${flag}`);
				if (flag === false) {
					await saveTheDeviceNameOfCurrentDevice(
						generatedDeviceName,
						checkOrAttachDeviceIdResponse,
					);
					return;
				}
			}
		}
	};

	const saveTheDeviceNameOfCurrentDevice = async (
		generatedDeviceName,
		checkOrAttachDeviceIdResponse,
	) => {
		console.log(`generatedDeviceName here : ${generatedDeviceName}`);
		return axios
			.post(
				`http://localhost:8080/api/devices/device/${checkOrAttachDeviceIdResponse}`,
				{ generatedDeviceName },
			)
			.then((saveTheDeviceNameOfCurrentDeviceResponse) => {
				console.log(
					"saveTheDeviceNameOfCurrentDeviceResponse",
					saveTheDeviceNameOfCurrentDeviceResponse,
				);

				if (
					saveTheDeviceNameOfCurrentDeviceResponse.data.updatedDeviceName ===
					true
				) {
					console.log("The device name is saved in the database");
					localStorage.setItem("deviceName", generatedDeviceName);
				}
			})
			.catch((err) => {
				console.error(
					"error encountered in saving the device name of the current device",
					err,
				);
			});
	};
	const checkIfDeviceNameExists = async (generatedDeviceName) => {
		return axios
			.get(`http://localhost:8080/api/devices/newdevice/${generatedDeviceName}`)
			.then((checkIfDeviceNameExistsResponse) => {
				console.log(
					"checkIfDeviceNameExistsResponse",
					checkIfDeviceNameExistsResponse,
				);

				if (
					checkIfDeviceNameExistsResponse.data.deviceNameChecked === true &&
					checkIfDeviceNameExistsResponse.data.deviceNameExists === true
				)
					return true;
			})
			.catch((err) => {
				console.error(
					"Error encountered in checking if the device name exists on client side",
					err,
				);
				const { code } = err.response.data;

				if (code === 102) return false;
			});
	};
	const getDeviceIdAndDeviceName = async () => {
		return checkOrAttachDeviceId().then((checkOrAttachDeviceIdResponse) => {
			console.log(
				"checkOrAttachDeviceIdResponse : ",
				checkOrAttachDeviceIdResponse,
			);

			if (checkOrAttachDeviceIdResponse === null) return;

			if (localStorage.getItem("deviceName")) {
				setCurrentDeviceName(localStorage.getItem("deviceName"));
				return;
			}

			return generateDeviceName(checkOrAttachDeviceIdResponse);
		});
	};
	useEffect(() => {
		getDeviceIdAndDeviceName();
	}, [currentDeviceId]);

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
						<Route path="/potentialConnections">
							<PotentialConnections currentDeviceId={currentDeviceId} />
						</Route>
						<Route path="/">
							<TextInputScreen currentDeviceId={currentDeviceId} />
						</Route>
					</Switch>
				) : null}
			</Router>
		</div>
	);
}

export default App;

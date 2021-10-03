import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import HomeScreen from './screens/HomeScreen';
import CodeInputScreen from './screens/CodeInputScreen';
import TextInputScreen from './screens/TextInputScreen';
import LinkToDeviceScreen from './screens/LinkToDeviceScreen';
import axios from 'axios';
// import Example from "./screens/Example";

function App() {
	const [currentDeviceId, setCurrentDeviceId] = useState('');
	const checkOrAttachDeviceId = () => {
		// var deviceId = JSON.parse(localStorage.getItem("device_id"));
		if (localStorage.getItem('device_id') == null) {
			var device_id = uuidv4();
			//console.log(device_id);
			localStorage.setItem('device_id', JSON.stringify(device_id));
			//console.log("val", localStorage.getItem("device_id"));

			let deviceIDSaved = axios.post(
				'http://localhost:8080/api/devices/newdevice',
				{
					device_id,
				},
			);
			deviceIDSaved.then((response) => {
				console.log(' deviceIDSaved response: ', response);
			});
		}

		var current_device_id = JSON.parse(localStorage.getItem('device_id'));
		console.log('current_device_id', current_device_id);
		return current_device_id;
	};

	// const checkOrAttachDeviceName = () => {};

	useEffect(() => {
		var deviceId = checkOrAttachDeviceId();
		console.log('deviceId in useEffect', deviceId);
		// checkOrAttachDeviceName();
		setCurrentDeviceId(deviceId);
	}, []);

	return (
		<div className='app'>
			<Router>
				<Switch>
					<Route path='/code'>
						<CodeInputScreen />
					</Route>
					<Route path='/text'>
						<TextInputScreen currentDeviceId={currentDeviceId} />
					</Route>
					<Route path='/linktoanewdevice'>
						<LinkToDeviceScreen />
					</Route>
					{/* <Route path="/trash">
            <Example />
          </Route> */}

					<Route path='/'>
						<HomeScreen />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;

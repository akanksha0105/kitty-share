import React, { useEffect, useState } from "react";
import { getConnections } from "../functions/sendToConnectionsScreenFunctions";
import { getPotentialConnections } from "../functions/potentialConnectionsFunctions";
import PotentialConnectionsList from "../components/PotentialConnectionsList";

function PotentialConnections(props) {
	const { currentDeviceId } = props;
	let verticesList = new Map();
	let count = 1;
	let adjacencyList = new Map();
	const [potentialConnectionsList, setPotentialConnectionsList] = useState([]);
	const [finalAdjacencyList, setFinalAdjacencyList] = useState({});
	const [errorMessage, setErrorMessage] = useState("");

	const onGetConnections = async () => {
		// let device_id = location.state?.currentDeviceId.currentDeviceId;
		console.log("In get onConnections");
		let device_id = currentDeviceId;
		console.log("device_id in sendToConnections component", device_id);

		getConnections(device_id)
			.then((getConnectionsPromiseResponse) => {
				console.log(
					"getConnectionsPromiseResponse",
					getConnectionsPromiseResponse,
				);
				const { data, connectionsExists } = getConnectionsPromiseResponse;
				if (connectionsExists === false) {
					console.log("No connections");
					setErrorMessage("No connections found");
					//Make a no connections component
					return null;
				}

				return getPotentialConnections(data, currentDeviceId);
			})
			.then((resullt1) => {
				console.log("result1", resullt1);
			})

			.catch((err) => {
				console.error(err);
				setErrorMessage(err.Message);
			});
	};

	useEffect(() => {
		onGetConnections();
	}, []);

	return <div className="potential__connections"></div>;
}

export default PotentialConnections;

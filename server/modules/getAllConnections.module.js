const ConnectionsModel = require("../models/connectionsModel");
// let result = new Set();
// let visited = {};
let finalAdjacencyList = new Map();
const getAllConnections = async (currentDeviceId) => {
	// console.log("Initial Visited Array: ", visited);
	let adjacencyList = new Map();
	console.log(
		`In getPotentialConnections function with currentDeviceId : ${currentDeviceId}`,
	);

	let result = new Set();
	// let visited = new Object();
	return getAllPossibleConnections(currentDeviceId, adjacencyList, {}, result)
		.then((getAllPossibleConnectionsResponse) => {
			console.log(
				"getAllPossibleConnectionsResponse :",
				getAllPossibleConnectionsResponse,
			);

			console.log("result in the  call : ", result);

			return result;
		})
		.then((resultSetResponse) => {
			let ans = [];
			[...resultSetResponse].filter((item) => {
				if (item !== currentDeviceId) {
					ans.push(item);
				}
			});

			console.log("Final ANS : ", ans);

			return ans;
		})
		.catch((err) => {
			console.error(err);
		});
};

const getAllPossibleConnections = async (
	currentVertex,
	adjacencyList,
	visited,
	result,
) => {
	console.log(
		"In getAllPossibleConnections function with currentVertex : ",
		currentVertex,
	);

	console.log(" Initial visited:", visited);
	visited[currentVertex] = true;
	console.log("visited : ", visited);
	result.add(currentVertex);
	console.log("result : ", result);

	let currentVertexConnections = await getConnections(currentVertex);
	let currentVertexConnectionsArrayLength = currentVertexConnections.length;
	console.log("currentVertexConnections : ", currentVertexConnections);
	console.log(
		"currentVertexConnectionsArrayLength",
		currentVertexConnectionsArrayLength,
	);

	if (currentVertexConnectionsArrayLength) {
		for (let i = 0; i < currentVertexConnectionsArrayLength; i++) {
			console.log("connectionItem", currentVertexConnections[i]);
			finalAdjacencyList = addEdge(
				currentVertex,
				currentVertexConnections[i],
				adjacencyList,
			);

			console.log("finalAdjacencyList : ", finalAdjacencyList);
		}

		console.log("finalAdjacencyList after for loop: ", finalAdjacencyList);

		for (let i = 0; i < finalAdjacencyList.get(currentVertex).size; i++) {
			// console.log("neighbor :", neighbor);
			console.log(
				"finalAdjacencyList.get(currentVertex)",
				finalAdjacencyList.get(currentVertex),
			);

			let x = [...finalAdjacencyList.get(currentVertex)];

			console.log("x", x);
			console.log("x[i]", x[i]);
			if (!visited[x[i]])
				await getAllPossibleConnections(
					x[i],
					finalAdjacencyList,
					visited,
					result,
				);
		}
	} else {
		return result;
	}
};

const getConnections = async (device_id) => {
	console.log(
		`In getConnectionsOfCurrentDevice function for getting connections of ${device_id}`,
	);

	return await ConnectionsModel.find({ deviceId: device_id })
		.then((connectionsModelResponse) => {
			if (connectionsModelResponse.length <= 0) {
				console.log("No connections found");

				return [];
			}

			let connectionsList = connectionsModelResponse[0].connections;
			// console.log("connectiosnList", connectionsList);
			let connectionsDeviceArray = [];
			return connectionsListFunction(connectionsList, connectionsDeviceArray);
		})
		.then((finalArray) => {
			console.log("Final Array :", finalArray);
			if (finalArray.length > 0) {
				return finalArray;
			}

			return [];
		})
		.catch((err) => {
			console.error("Error in retrieving connections", err);

			let getConnectionsOutput = {
				data: "Error encountered in getting connections ",
				connectionsExists: false,
			};
			return getConnectionsOutput;
		});
};

const addEdge = (source, destination, adjacencyList) => {
	console.log("......");
	if (!adjacencyList.has(source)) {
		adjacencyList.set(source, new Set([destination]));
	} else {
		adjacencyList.get(source).add(destination);
	}

	if (!adjacencyList.has(destination)) {
		adjacencyList.set(destination, new Set([source]));
	} else {
		adjacencyList.get(destination).add(source);
	}

	return adjacencyList;
};
const connectionsListFunction = async (
	connectionsList,
	connectionsDeviceArray,
) => {
	connectionsList.map((connectionItem) => {
		// console.log("connectionItem.deviceId", connectionItem.deviceId);
		connectionsDeviceArray.push(connectionItem.deviceId);
	});
	return connectionsDeviceArray;
};

module.exports = { getAllConnections };

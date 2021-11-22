// import { getConnections } from "../functions/sendToConnectionsScreenFunctions";
// import axios from "axios";
const ConnectionsModel = require("../models/connectionsModel");
let adjacencyList = new Map();
let verticesList = new Map();
let count = 1;

const getConnections = async (device_id) => {
	console.log(
		`In getConnectionsOfCurrentDevice function for getting connections of ${device_id}`,
	);

	return ConnectionsModel.find({ deviceId: device_id })
		.then((connectionsModelResponse) => {
			if (connectionsModelResponse.length <= 0) {
				console.log("No connections found");
				let getConnectionsOutput = {
					data: "No connections found",
					connectionsExists: false,
				};
				return getConnectionsOutput;
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

const addEdge = (source, destination) => {
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
// const result = new Set();
const visited = {};
let fR;
let finalAdjacencyList = new Map();
let result = new Set();

const getAllPossibleConnections = async (currentVertex) => {
	console.log(
		"In getAllPossibleConnections function with currentVertex : ",
		currentVertex,
	);

	console.log(
		"In getAllPossibleConnections function with adjacencyList : ",
		adjacencyList,
	);

	visited[currentVertex] = true;
	console.log("visited : ", visited);
	result.add(currentVertex);
	console.log("result : ", result);

	await getConnections(currentVertex);

	// then((currentVertexConnections) => {
	// 	let currentVertexConnectionsArrayLength = currentVertexConnections.length;

	// 	if (currentVertexConnectionsArrayLength <= 0) {
	// 		return { result: result };
	// 	} else {
	// 		for (let i = 0; i < currentVertexConnectionsArrayLength; i++) {
	// 			console.log("connectionItem", currentVertexConnections[i]);
	// 			finalAdjacencyList = addEdge(
	// 				currentVertex,
	// 				currentVertexConnections[i],
	// 			);
	// 		}

	// 		console.log("finalAdjacencyList after  : ", finalAdjacencyList);

	// 		finalAdjacencyList.get(currentVertex).forEach((neighbor) => {
	// 			if (!visited[neighbor])
	// 				return await getAllPossibleConnections(
	// 					neighbor,
	// 					finalAdjacencyList,
	// 					result,
	// 				);
	// 		});
	// 	}
	// });
};

const getAllConnections = async (currentDeviceId) => {
	console.log(
		`In getPotentialConnections function with currentDeviceId : ${currentDeviceId}`,
	);

	getAllPossibleConnections(currentDeviceId).then(
		(getAllPossibleConnectionsResponse) => {
			console.log(
				"getAllPossibleConnectionsResponse :",
				getAllPossibleConnectionsResponse,
			);

			console.log("result in the final call : ", result);
		},
	);
	// .catch((err) => {
	// 	console.error(err);
	// });
};

module.exports = { getAllConnections };

// const dfsRecursive = async (currentVertex) => {
// 	console.log("In dfsRecursive, currentVertex is : ", currentVertex);
// 	visited[currentVertex] = true;
// 	console.log("visited : ", visited);
// 	result.add(currentVertex);
// 	console.log("result : ", result);

// 	let currentVertexConnections = await getConnections(currentVertex);

// 	console.log("currentVertexConnections", currentVertexConnections);
// 	console.log("length", currentVertexConnections.length);

// 	if (currentVertexConnections.length <= 0) {
// 		return;
// 	}
// 	currentVertexConnections.map((connectionItem) => {
// 		console.log("connectionItem", connectionItem);
// 		addEdge(currentVertex, connectionItem);
// 	});
// 	console.log("adjacencyList : ", adjacencyList);

// 	adjacencyList.get(currentVertex).forEach((neighbor) => {
// 		if (!visited[neighbor]) return dfsRecursive(neighbor);
// 	});

// 	return { result: result, visited: visited, adjacencyList: adjacencyList };
// };

// const getAllConnections = async (currentDeviceId) => {
// 	console.log(`In getPotentialConnections function`);

// 	return dfsRecursive(currentDeviceId)
// 		.then((dfsResult) => {
// 			console.log("dfsResult", dfsResult);
// 			return dfsResult;
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
// return constructVerticesListMapOfSource(
// 	currentDeviceConnectionsArray,
// 	currentDeviceId,
// )
// 	.then((constructVerticesListMapOfSourceResponse) => {
// 		console.log(
// 			"constructVerticesListMapOfSourceResponse",
// 			constructVerticesListMapOfSourceResponse,
// 		);

// 		return createVerticesListMapOfConnectionsOfCurrentDevice(
// 			constructVerticesListMapOfSourceResponse,
// 			currentDeviceConnectionsArray,
// 		);
// 	})
// 	.then((createVerticesListMapOfConnectionsOfCurrentDeviceResponse) => {
// 		console.log(
// 			"createVerticesListMapOfConnectionsOfCurrentDeviceResponse",
// 			createVerticesListMapOfConnectionsOfCurrentDeviceResponse,
// 		);

// 		const { verticesList, adjacencyList } =
// 			createVerticesListMapOfConnectionsOfCurrentDeviceResponse;

// 		let dfsRecursiveArray = dfsRecursive(0, adjacencyList);
// 		return {
// 			verticesList: verticesList,
// 			dfsRecursiveArray: dfsRecursiveArray,
// 		};
// 	})
// 	.then((dfsRecursiveResponse) => {
// 		console.log("dfsRecursiveResponse", dfsRecursiveResponse);
// 		const { verticesList, dfsRecursiveArray } = dfsRecursiveResponse;
// 		return getConnectionsArray(dfsRecursiveArray, 0, verticesList);
// 	})
// 	.then((getConnectionsResponse) => {
// 		console.log("getConnectionsResponse", getConnectionsResponse);
// 		return getConnectionsResponse;
// 	});
// };

// const createVerticesListMapOfConnectionsOfCurrentDevice = async (
// 	arg1,
// 	currentDeviceConnectionsArray,
// ) => {
// 	console.log("arg1", arg1);
// 	console.log("currentDeviceConnectionsArray", currentDeviceConnectionsArray);
// 	const { verticesList, adjacencyList } = arg1;
// 	let getConnectionsOfCurrentDeviceConnection;
// 	for (let i = 0; i < currentDeviceConnectionsArray.length; i++) {
// 		getConnectionsOfCurrentDeviceConnection = await getConnections(
// 			currentDeviceConnectionsArray[i].deviceId,
// 		).then((response) => {
// 			for (let i = 0; i < response.data.length; i++) {
// 				if (!verticesList.has(response.data[i].deviceId)) {
// 					verticesList.set(response.data[i].deviceId, count);
// 					count++;
// 				}

// 				addEdge(
// 					verticesList.get(currentDeviceConnectionsArray[i].deviceId),
// 					verticesList.get(response.data[i].deviceId),
// 				);
// 			}

// 			return { verticesList: verticesList, adjacencyList: adjacencyList };
// 		});
// 	}

// 	return getConnectionsOfCurrentDeviceConnection;
// };

// const constructVerticesListMapOfSource = async (
// 	currentDeviceConnectionsArray,
// 	currentDeviceId,
// ) => {
// 	console.log(`In constructVerticesListMap function`);
// 	verticesList.set(currentDeviceId, 0);
// 	for (let i = 0; i < currentDeviceConnectionsArray.length; i++) {
// 		if (!verticesList.has(currentDeviceConnectionsArray[i].deviceId)) {
// 			verticesList.set(currentDeviceConnectionsArray[i].deviceId, count);
// 			count++;
// 		}
// 		addEdge(
// 			verticesList.get(currentDeviceId),
// 			verticesList.get(currentDeviceConnectionsArray[i].deviceId),
// 		);
// 	}

// 	return { verticesList: verticesList, adjacencyList: adjacencyList };
// };

// const result = [];
// const visited = {};
// const dfsRecursive = (vertex, finalAdjacencyList) => {
// 	console.log("In dfsRecursive function, adjList : ", finalAdjacencyList);

// 	console.log("vertex : ", vertex);
// 	visited[vertex] = true;

// 	console.log("visited : ", visited);
// 	// result.add(vertex);
// 	result.push(vertex);

// 	console.log("result : ", result);

// 	finalAdjacencyList.get(vertex).forEach((neighbor) => {
// 		if (!visited[neighbor]) {
// 			return dfsRecursive(neighbor, finalAdjacencyList);
// 		}
// 	});

// 	return result;
// };

const getConnectionsArray = (
	dfsArray,
	initialSourceVertex,
	verticesListMap,
) => {
	let connectionsArray = [];
	let connectionsArrayMappedVertices = dfsArray.filter(
		(item) => item !== initialSourceVertex,
	);

	console.log("connectionsArrayMappedVertices", connectionsArrayMappedVertices);
	console.log("verticesListMap", verticesListMap);

	for (let connection of connectionsArrayMappedVertices) {
		// let [key, value] = verticesListMap.entries();
		// console.log("key", key, "value", value);
		// if (value === connection) connectionsArray.push(key);

		verticesListMap.forEach((value, key, map) => {
			// alert(`${key}: ${value}`); // cucumber: 500 etc
			if (value === connection) connectionsArray.push(key);
		});
	}

	return connectionsArray;
};

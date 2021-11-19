import { getConnections } from "../functions/sendToConnectionsScreenFunctions";
let adjacencyList = new Map();
let verticesList = new Map();
let count = 1;

export const getPotentialConnections = async (
	currentDeviceConnectionsArray,
	currentDeviceId,
) => {
	console.log(`In getPotentialConnections function`);

	return constructVerticesListMapOfSource(
		currentDeviceConnectionsArray,
		currentDeviceId,
	)
		.then((constructVerticesListMapOfSourceResponse) => {
			console.log(
				"constructVerticesListMapOfSourceResponse",
				constructVerticesListMapOfSourceResponse,
			);

			return createVerticesListMapOfConnectionsOfCurrentDevice(
				constructVerticesListMapOfSourceResponse,
				currentDeviceConnectionsArray,
			);
		})
		.then((createVerticesListMapOfConnectionsOfCurrentDeviceResponse) => {
			console.log(
				"createVerticesListMapOfConnectionsOfCurrentDeviceResponse",
				createVerticesListMapOfConnectionsOfCurrentDeviceResponse,
			);

			const { verticesList, adjacencyList } =
				createVerticesListMapOfConnectionsOfCurrentDeviceResponse;
			// return dfsRecursive(0, adjacencyList);
			let dfsRecursiveArray = dfsRecursive(0, adjacencyList);
			return {
				verticesList: verticesList,
				dfsRecursiveArray: dfsRecursiveArray,
			};
		})
		.then((dfsRecursiveResponse) => {
			console.log("dfsRecursiveResponse", dfsRecursiveResponse);
			const { verticesList, dfsRecursiveArray } = dfsRecursiveResponse;
			return getConnectionsArray(dfsRecursiveArray, 0, verticesList);
		})
		.then((getConnectionsResponse) => {
			console.log("getConnectionsResponse", getConnectionsResponse);
			return getConnectionsResponse;
		});
};

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
// const result = new Set();
const result = [];
const visited = {};
const dfsRecursive = (vertex, finalAdjacencyList) => {
	console.log("In dfsRecursive function, adjList : ", finalAdjacencyList);

	console.log("vertex : ", vertex);
	visited[vertex] = true;

	console.log("visited : ", visited);
	// result.add(vertex);
	result.push(vertex);

	console.log("result : ", result);

	finalAdjacencyList.get(vertex).forEach((neighbor) => {
		if (!visited[neighbor]) {
			return dfsRecursive(neighbor, finalAdjacencyList);
		}
	});

	return result;
};

const constructVerticesListMapOfSource = async (
	currentDeviceConnectionsArray,
	currentDeviceId,
) => {
	console.log(`In constructVerticesListMap function`);
	verticesList.set(currentDeviceId, 0);
	for (let i = 0; i < currentDeviceConnectionsArray.length; i++) {
		if (!verticesList.has(currentDeviceConnectionsArray[i].deviceId)) {
			verticesList.set(currentDeviceConnectionsArray[i].deviceId, count);
			count++;
		}
		addEdge(
			verticesList.get(currentDeviceId),
			verticesList.get(currentDeviceConnectionsArray[i].deviceId),
		);
	}

	return { verticesList: verticesList, adjacencyList: adjacencyList };
};

const createVerticesListMapOfConnectionsOfCurrentDevice = async (
	arg1,
	currentDeviceConnectionsArray,
) => {
	console.log("arg1", arg1);
	console.log("currentDeviceConnectionsArray", currentDeviceConnectionsArray);
	const { verticesList, adjacencyList } = arg1;
	let getConnectionsOfCurrentDeviceConnection;
	for (let i = 0; i < currentDeviceConnectionsArray.length; i++) {
		getConnectionsOfCurrentDeviceConnection = await getConnections(
			currentDeviceConnectionsArray[i].deviceId,
		).then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				if (!verticesList.has(response.data[i].deviceId)) {
					verticesList.set(response.data[i].deviceId, count);
					count++;
				}

				addEdge(
					verticesList.get(currentDeviceConnectionsArray[i].deviceId),
					verticesList.get(response.data[i].deviceId),
				);
			}

			return { verticesList: verticesList, adjacencyList: adjacencyList };
		});
	}

	return getConnectionsOfCurrentDeviceConnection;
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
};

// const createVerticesListMap = async (
// 	currentDeviceConnectionsArray,
// 	currentDeviceId,
// ) => {
// 	console.log("In createVerticesListMap function");
// 	console.log("currentDeviceConnectionsArray", currentDeviceConnectionsArray);
// 	let m;
// 	for (let i = 0; i < currentDeviceConnectionsArray.length; i++) {
// 		let getConnectionsOfCurrentDeviceConnection = getConnections(
// 			currentDeviceConnectionsArray[i].deviceId,
// 		);

// 		m = await getConnectionsOfCurrentDeviceConnection.then((response) => {
// 			console.log("Response : ", response);
// 			for (let i = 0; i < response.data.length; i++) {
// 				if (!verticesList.has(response.data[i].deviceId)) {
// 					verticesList.set(response.data[i].deviceId, count);
// 					count++;
// 				}
// 			}

// 			return verticesList;
// 		});

// 		console.log("m", m);
// 	}
// 	return m;
// };

// adjacencyList.set(0, new Set([1, 2]));
// adjacencyList.set(1, new Set([0, 2, 4]));
// adjacencyList.set(2, new Set([0, 1, 3]));
// adjacencyList.set(3, new Set([2]));
// adjacencyList.set(4, new Set([1]));

import axios from "axios";
import { baseURL } from "../helper";

export const getConnections = async (device_id) => {
	return await axios
		.get(`${baseURL}/api/connections/getAllConnections/${device_id} `)
		.then((getConnectionsResponse) => {
			let data = getConnectionsResponse.data.message;

			let getConnectionsOutput = { data: data, connectionsExists: true };
			return getConnectionsOutput;
		})
		.catch((err) => {
			const { code } = err.response.data;

			if (code == 102) {
				console.error("No connections found");
				let getConnectionsOutput = {
					data: "No connections found",
					connectionsExists: false,
				};
				return getConnectionsOutput;
			} else {
				console.error(
					"Error encountered in getting connections on client side in sendToConnections component",
					err,
				);
				let getConnectionsOutput = {
					data: "Error encountered in getting connections on client side in sendToConnections component",
					connectionsExists: false,
				};
				return getConnectionsOutput;
			}
		});
};

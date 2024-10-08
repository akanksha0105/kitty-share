import React from "react";
import Loading from "../components/Loading";

function WebsiteLoader() {
	return (
		<div className="website__loader">
			<Loading />
			<div className="loading__text">Loading</div>
		</div>
	);
}

export default WebsiteLoader;

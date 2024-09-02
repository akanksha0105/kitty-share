import React from "react";
import "../styles/Loading.css";

function Loading() {
	return (
		<div className="loader">
			<div className="lds-ellipsis">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}

export default Loading;

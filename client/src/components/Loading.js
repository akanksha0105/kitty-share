import React from "react";
import "../styles/Loading.css";

function Loading() {
	return (
		<div className="loader">
			<div class="lds-ellipsis">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}

export default Loading;

import React from "react";
import "../styles/Loading.css";

function Loading() {
	return (
		<div class="loader">
			<div class="box">
				<div class="cat">
					<div class="cat__body"></div>
					<div class="cat__body"></div>
					<div class="cat__tail"></div>
					<div class="cat__head"></div>
				</div>
			</div>
		</div>
	);
}

export default Loading;

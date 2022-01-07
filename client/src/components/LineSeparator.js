import React from "react";
import "../styles/LineSeparator.css";

function LineSeparator({ showTextInput }) {
	return (
		<div className={showTextInput ? "line__separator" : "display-none"}>
			<div className="line__on__side"></div>
			<div className="separator__word">OR</div>
			<div className="line__on__side"></div>
		</div>
	);
}

export default LineSeparator;

import React from "react";
import "../styles/LineSeparator.css";

function LineSeparator({ showTextInput, showCodeInput }) {
	const showLineSeparator = () => {
		if (showTextInput === true && showCodeInput === true)
			return "line__separator";
		else return "display-none";
	};
	return (
		// <div className={showTextInput ? "line__separator" : "display-none"}>
		<div className={showLineSeparator()}>
			<div className="line__on__side"></div>
			<div className="separator__word">OR</div>
			<div className="line__on__side"></div>
		</div>
	);
}

export default LineSeparator;

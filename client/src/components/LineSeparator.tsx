import React from "react";
import "../styles/LineSeparator.css";

interface LineSeparatorProps {
	showTextInput: boolean,
	showCodeInput: boolean,
}

const LineSeparator : React.FC<LineSeparatorProps> = ({ showTextInput, showCodeInput }) =>{
	const showLineSeparator = () => {
		if (showTextInput && showCodeInput)
			return "line__separator";
		else return "display-none";
	};
	return (
		
		<div className={showLineSeparator()}>
			<div className="line__on__side"></div>
			<div className="separator__word">OR</div>
			<div className="line__on__side"></div>
		</div>
	);
}

export default LineSeparator;

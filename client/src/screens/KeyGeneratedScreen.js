import React from "react";
import "../styles/KeyGeneratedScreen.css";
import "../styles/styles.css";

function KeyGeneratedScreen({ generatedCode }) {
	return (
		<div className="container__screen">
			<div className="output__text">
				GENERATED KEY
				<div className="output__box">{generatedCode}</div>
			</div>
		</div>
	);
}

export default KeyGeneratedScreen;

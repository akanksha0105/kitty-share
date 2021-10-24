import React from "react";
import "../styles/KeyGeneratedScreen.css";
import Loading from "../screens/Loading";

function KeyGeneratedScreen({ generatedCode }) {
	if (generatedCode === "") return <Loading />;
	return (
		<div className="container__screen">
			<div className="output__text">
				GENERATED KEY
				<br />
				<div className="output__box">{generatedCode}</div>
			</div>
		</div>
	);
}

export default KeyGeneratedScreen;

import React from "react";
import "../styles/KeyGeneratedScreen.css";
import Loading from "../components/Loading";

function KeyGeneratedScreen({ generatedCode }) {
	if (generatedCode === "") return <Loading />;
	return (
		<div className="container__screen">
			<div className="output__box">{generatedCode}</div>
		</div>
	);
}
export default KeyGeneratedScreen;

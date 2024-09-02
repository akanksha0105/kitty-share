import React from "react";
import "../styles/KeyGeneratedScreen.css";
import Loading from "./Loading";

interface KeyGeneratedScreenProps {
	generatedCode: string
}

const KeyGeneratedScreen: React.FC<KeyGeneratedScreenProps>=({ generatedCode })=> {
	if (generatedCode === "") return <Loading />;
	return (
		<div className="container__screen">
			<div className="output__box">{generatedCode}</div>
		</div>
	);
}
export default KeyGeneratedScreen;

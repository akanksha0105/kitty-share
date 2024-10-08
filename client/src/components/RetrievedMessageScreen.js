import React from "react";
import Loading from "./Loading";
import "../styles/KeyGeneratedScreen.css";
function RetrievedMessageScreen({ retrievedMessage }) {
	if (retrievedMessage === "") return <Loading />;
	return (
		<div className="retrieved__container__screen">
			<div className="retrieved__output__box"> {retrievedMessage} </div>
		</div>
	);
}

export default RetrievedMessageScreen;

import React from "react";
import Loading from "../components/Loading";
import "../styles/KeyGeneratedScreen.css";
function RetrievedMessageScreen({ retrievedMessage }) {
	if (retrievedMessage === "") return <Loading />;
	return (
		<div className="container__screen">
			<div className="output__box"> {retrievedMessage} </div>
		</div>
	);
}

export default RetrievedMessageScreen;

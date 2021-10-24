import React from "react";
import Loading from "../screens/Loading";
import "../styles/KeyGeneratedScreen.css";
function RetrievedMessageScreen({ retrievedMessage }) {
	if (retrievedMessage === "") return <Loading />;
	return (
		<div className="container__screen">
			<div className="output__text">
				GENERATED MESSAGE
				<div className="output__box"> {retrievedMessage} </div>
			</div>

			<br />
		</div>
	);
}

export default RetrievedMessageScreen;

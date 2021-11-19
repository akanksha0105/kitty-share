import React from "react";
import "../styles/Message.css";

function ErrorMessage(props) {
	console.log("In the ErrorMessage Component");
	const { message } = props;
	return (
		<div className="message error__message">
			<div className="error__message__content">{message}</div>
		</div>
	);
}

export default ErrorMessage;

import React from "react";

import "../styles/Message.css";
function SuccessMessage(props) {
	const { message } = props;
	return (
		<div className="message success__message">
			<div className="success__message__content">{message}</div>
		</div>
	);
}

export default SuccessMessage;

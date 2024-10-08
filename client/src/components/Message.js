import React from "react";
import "../styles/Message.css";
function Message(props) {
	const { message } = props;

	return (
		<div className="message">
			<div className="message__content">{message}</div>
		</div>
	);
}

export default Message;

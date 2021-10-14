import React from "react";
import "../styles/Message.css";
function Message(props) {
	console.log("In message component");
	const { message } = props;

	return <div className="message">{message}</div>;
}

export default Message;

import React from "react";
import "./Message.css";
function Message(props) {
	console.log("In message component");
	const { messageHeader, messageContent } = props;
	return (
		<div className="message">
			<div className="message__header">
				{messageHeader}
				<div className="message __content">{messageContent}</div>
			</div>
		</div>
	);
}

export default Message;

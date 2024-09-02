import React from "react";
import "../styles/Message.css";

interface MessageProps {
	message: string,
}
const Message: React.FC<MessageProps> = (props) => {
	const { message } = props;

	return (
		<div className="message">
			<div className="message__content">{message}</div>
		</div>
	);
};

export default Message;

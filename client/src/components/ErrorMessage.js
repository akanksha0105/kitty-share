import React from "react";
import "../styles/Message.css";

function ErrorMessage(props) {
	const { message } = props;
	return (
		<div className='message error__message'>
			<div className='error__message__content'>{message}</div>
		</div>
	);
}

export default ErrorMessage;

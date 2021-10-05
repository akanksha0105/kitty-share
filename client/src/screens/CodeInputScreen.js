import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function CodeInputScreen() {
	const [isDisabled, setIsDisabled] = useState(false);
	const [codeInputValue, setCodeInputValue] = useState("");
	const [retrievedMessage, setRetrievedMessage] = useState("");
	const onGenerateMessage = (event) => {
		event.preventDefault();
		console.log("Secret key for the URL entered");
		retrieveMessage();
		setIsDisabled(!isDisabled);
	};

	const retrieveMessage = async () => {
		const codedMessage = codeInputValue;

		let retrievedMessagePromise = axios.post(
			"http://localhost:8080/api/code/getcodegenerated",
			{
				codedMessage,
			},
		);

		retrievedMessagePromise
			.then((response) => {
				// console.log(response.data.data);
				setRetrievedMessage(response.data.data);
				console.log("URL provided by the server", retrievedMessage);
				console.log(response.data.message);
			})
			.catch((error) => console.log(error.response.data));
	};

	return (
		<div className="code__input__screen">
			{!isDisabled ? (
				<div className="input__key__form">
					<form onSubmit={onGenerateMessage}>
						<label>
							<input
								name="name"
								id="name"
								type="text"
								value={codeInputValue}
								onChange={(event) => setCodeInputValue(event.target.value)}
								required
							/>
							<div className="label-text">Enter the Input Key</div>
						</label>
						<br />

						<button type="submit">Generate the Message</button>
					</form>
				</div>
			) : (
				<div className="key__generated__form">
					<form>
						<label>
							<input
								name="name"
								id="name"
								type="text"
								value={retrievedMessage}
								// readOnly={true}
							/>
							<div className="label-text">Generated Message</div>
						</label>
						<br />
					</form>
				</div>
			)}
			<Link to="/text">
				<button>Move to the Text Input Screen</button>
			</Link>
		</div>
	);
}

export default CodeInputScreen;

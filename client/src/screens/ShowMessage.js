import { useEffect, useState, React } from "react";
import axios from "axios";
import "../styles/ShowMessage.css";
import ErrorMessage from "../components/ErrorMessage";
function ShowMessage() {
	const [answer, setAnswer] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const retrieveTextNote = () => {
		let array = [];
		array = window.location.href.split("/showmessage/");
		let newCode = array[1];

		axios
			.get(`/api/text/gettextnote/${newCode}`)
			.then((retrieveTextNoteResponse) => {
				const { data, messageRetrieved } = retrieveTextNoteResponse.data;

				if (messageRetrieved === true) {
					setAnswer(data);
				}
			})
			.catch((err) => {
				const { code } = err.response.data;
				setErrorMessage("Unable to retrieve textnote");
			});
	};
	useEffect(() => {
		retrieveTextNote();

		// getFromStore();
	});
	return (
		<div className='show__message'>
			{answer.length > 0 ? (
				<div className='show__message__content'>{answer}</div>
			) : null}

			{errorMessage ? <ErrorMessage message={errorMessage} /> : null}
		</div>
	);
}

export default ShowMessage;

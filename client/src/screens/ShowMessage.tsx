import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ShowMessage.css";
import ErrorMessage from "../components/ErrorMessage";
import React from "react";
const ShowMessage: React.FC = () => {
	const [answer, setAnswer] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const retrieveTextNote = () => {
		console.log("In retrieveTextNote");
		let array = [];
		array = window.location.href.split("/showmessage/");
		let newCode = array[1];

		axios
			.get(`/api/text/gettextnote/${newCode}`)
			.then((retrieveTextNoteResponse) => {
				console.log("retrieveTextNoteResponse", retrieveTextNoteResponse);
				const { data, messageRetrieved } = retrieveTextNoteResponse.data;

				if (messageRetrieved === true) {
					setAnswer(data);
				}
			})
			.catch((err) => {
				console.log("Error encountered in retrieving textnote : ", err);
				const { code } = err.response.data;
				setErrorMessage("Unable to retrieve textnote");
			});
	};
	useEffect(() => {
		console.log("In Show Message component");
		retrieveTextNote();

		// getFromStore();
	});
	return (
		<div className="show__message">
			{answer.length > 0 ? (
				<div className="show__message__content">{answer}</div>
			) : null}

			{errorMessage ? <ErrorMessage message={errorMessage} /> : null}
		</div>
	);
};

export default ShowMessage;

// const getFromStore = async () => {
// 	const dbPromise = openDB(dbName, 1, function (upgradeDb) {
// 		if (!upgradeDb.objectStoreNames.contains("textnote")) {
// 			console.log("*");
// 			upgradeDb.createObjectStore("textnote", { autoIncrement: true });
// 			console.log("**");
// 		}
// 	});
// 	console.log("dbPromise in showMessage", dbPromise);
// 	dbPromise
// 		.then(function (db) {
// 			db.createObjectStore("textnote", { autoIncrement: true });
// 			console.log("***");
// 			console.log("db in showMessage", db);
// 			console.log("db in showMessage", db.objectStoreNames);
// 			var tx = db.transaction(["textnote"], "readwrite");
// 			var store = tx.objectStore(["textnote"]);
// 			return store.getAll();
// 		})
// 		.then(function (items) {
// 			console.log("Final textnote:", items.at(-1).value);
// 			setAnswer(items.at(-1).value);
// 		})
// 		// .then(function (items) {
// 		// 	console.log("Items by name:", items.reverse());
// 		// })
// 		.catch((err) => {
// 			console.error("Error encountered on showMessage on client side: ", err);
// 		});
// };

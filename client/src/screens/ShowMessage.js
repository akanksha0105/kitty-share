import { useEffect, useState, React } from "react";
import { openDB } from "idb";
import "../styles/ShowMessage.css";

function ShowMessage() {
	const dbName = "Notifications";
	const version = 1; // incremental ints
	const storeName = "textnote";
	let db; // define the db variable to be global in the sw file

	const [answer, setAnswer] = useState("");

	const getFromStore = async () => {
		const dbPromise = openDB(dbName, 1, function (upgradeDb) {
			if (!upgradeDb.objectStoreNames.contains(storeName)) {
				upgradeDb.createObjectStore(storeName, { autoIncrement: true });
			}
		});
		console.log("db in showMessage", dbPromise);

		dbPromise
			.then(function (db) {
				var tx = db.transaction(storeName, "readwrite");
				var store = tx.objectStore(storeName);
				return store.getAll();
			})
			.then(function (items) {
				console.log("Final textnote:", items.at(-1).value);
				setAnswer(items.at(-1).value);
			})
			// .then(function (items) {
			// 	console.log("Items by name:", items.reverse());
			// })
			.catch((err) => {
				console.error(err);
			});
	};
	useEffect(() => {
		console.log("In Show Message component");

		getFromStore();
	}, []);
	return <div className="show__message">{answer}</div>;
}

export default ShowMessage;

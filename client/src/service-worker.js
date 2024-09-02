const ignored = self.__WB_MANIFEST;
console.log("I am there. My name is Service Worker");

let url;
let newCode;
let isURL;
const dbName = "Notifications";
const version = 1; // incremental ints
const storeName = "textnote";
let db; // define the db variable to be global in the sw file
self.addEventListener("install", (event) => {
	console.log("Service Worker installed");
});

self.addEventListener("activate", function (event) {
	console.log("Service Worker activated");
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames
					.filter(function (cacheName) {
					})
					.map(function (cacheName) {
						return caches.delete(cacheName);
					}),
			);
		}),
	);
});
self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json();
		console.log("What the heck is event object here");
		console.log(data.title);
		console.log("Push event!! ", data);

		url = data.content;
		newCode = data.newCode;
		isURL = data.isURL;
		const options = {
			body: data.content,
			requireInteraction: true,
		};

		self.registration.showNotification(data.title, options);
	} else {
		console.log("Push event but no data");
	}
});

self.addEventListener("notificationclick", (event) => {
	console.log("On notification click");

	var notification = event.notification;

	console.log("Closed notification: " + notification);


	if (isURL === true) {
		event.notification.close();
		clients.openWindow(url);
		return;
	}

	let desiredURL = `https://kittyshare.xyz/showmessage/${newCode}`;
	console.log("desiredURL", desiredURL);
	clients.openWindow(desiredURL);



	return;


});

async function openDB(textnote) {
	// ask to open the db
	const openRequest = self.indexedDB.open(dbName, 1);

	openRequest.onerror = function (event) {
		console.log(
			"Everyhour isn't allowed to use IndexedDB?!" + event.target.errorCode,
		);
	};

	// upgrade needed is called when there is a new version of you db schema that has been defined
	openRequest.onupgradeneeded = function (event) {
		db = event.target.result;

		if (!db.objectStoreNames.contains(storeName)) {
			// if there's no store of 'storeName' create a new object store
			db.createObjectStore(storeName, { autoIncrement: true }); //some use keyPath: "id" (basically the primary key) - unsure why yet
		}
	};

	openRequest.onsuccess = function (event) {
		db = event.target.result;
		console.log("Hey I am db's result", db);
		console.log("textnote : ", textnote);
		addToStore(textnote, db);
	};
}

function validURL(str) {
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i",
	); // fragment locator
	return !!pattern.test(str);
}

// async function addToStore(key, value)
async function addToStore(value, db) {
	// start a transaction of actions you want to submit

	const transaction = db.transaction(storeName, "readwrite");

	// create an object store
	const store = transaction.objectStore(storeName);

	// add key and value to the store
	// const request = store.put({ key, value });
	const request = store.put({ value });

	request.onsuccess = function () {
		// console.log("added to the store", { key: value }, request.result);
		console.log("added to the store", request.result);
	};

	request.onerror = function () {
		console.log("Error did not save to store", request.error);
	};

	transaction.onerror = function (event) {
		console.log("trans failed", event);
	};

	transaction.oncomplete = function (event) {
		console.log("trans completed", event);
	};
}

async function getFromStore(key) {
	const request = store.get(key);
	console.log("request : ", request);
	request.onsuccess = function (event) {
		return request;
		// if (callback) {
		// 	callback(event.target.result.value); // this removes the {key:"key", value:"value"} structure
		// }
	};

	request.onerror = function () {
		console.log("Error did not read to store", request.error);
	};

	transaction.onerror = function (event) {
		console.log("trans failed", event);
	};
	transaction.oncomplete = function (event) {
		console.log("trans completed", event);
	};
}

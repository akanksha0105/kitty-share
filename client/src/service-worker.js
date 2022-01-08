const ignored = self.__WB_MANIFEST;
console.log("I am there. My name is Service Worker");

let url;
self.addEventListener("install", (event) => {
	console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
	console.log("Service Worker activated");
});

self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json();
		console.log("What the heck is event object here");
		console.log(data.title);
		console.log("Push event!! ", data);

		url = data.content;
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

	event.notification.close();
	let x = validURL(url);

	console.log("Is it a valid URL : ", x);

	if (x === false) {
		localStorage.setItem("notificationReceived", url);
		client.openWindow("/notification");
		return;
	}
	// navigator.serviceWorker.controller.postMessage(url, )

	clients.openWindow(url);
	return;
});

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

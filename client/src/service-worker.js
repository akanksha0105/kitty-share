let url;
const ignored = self.__WB_MANIFEST;
console.log("I am there. My name is Service Worker");

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

	// event.notification.close();

	clients.openWindow(url);
});

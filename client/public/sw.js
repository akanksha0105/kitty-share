const CACHE_NAME = "demo/v1";

const CACHE_FILES = ["./index.html", "./script.js"];

self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			cache.addAll(CACHE_FILES);
		}),
	);
});

self.addEventListener("activate", (e) => {
	// Clean up useless cache
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key != CACHE_NAME) {
						return caches.delete(key);
					}
				}),
			);
		}),
	);
});

self.addEventListener("fetch", (e) => {
	// Offline exprience
	// Whenever a file is requested,
	// 1. fetch from network, update my cache 2. cache as a fallback

	e.respondWith(
		fetch(e.request)
			.then((res) => {
				// update my cache
				const cloneData = res.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(e.request, cloneData);
				});
				console.log("returning from network");
				return res;
			})
			.catch(() => {
				console.log("returning from cache");
				return caches.match(e.request).then((file) => file);
			}),
	);
});

self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json();
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
		console.error("Push event but no data");
	}
});

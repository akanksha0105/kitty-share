import axios from "axios";
const isLocalhost = Boolean(
	window.location.hostname === "localhost" ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === "[::1]" ||
		// 127.0.0.0/8 are considered localhost for IPv4.
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
		),
);
const urlBase64ToUint8Array = (base64String) => {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

export function register(config) {
	if (!("serviceWorker" in navigator)) {
		// throw new Error("No Service Worker support!");
		console.error("No Service Worker Support!");
		return false;
	}
	if (!("PushManager" in window)) {
		//throw new Error("No Push API Support!");
		console.error("No Push API Support!");
		return false;
	}

	localStorage.setItem("notificationsServicePossible", true);
	if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
		// The URL constructor is available in all browsers that support SW.

		const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

		if (publicUrl.origin !== window.location.origin) {
			return;
		}

		window.addEventListener("load", () => {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

			if (isLocalhost) {
				checkValidServiceWorker(swUrl, config);

				navigator.serviceWorker.ready.then(() => {});
			} else {
				// Is not localhost. Just register service worker
				registerValidSW(swUrl, config);
			}
		});
	}
}

function registerValidSW(swUrl, config) {
	navigator.serviceWorker
		.register(swUrl)
		.then((registration) => {
			registration.onupdatefound = () => {
				const installingWorker = registration.installing;
				if (installingWorker == null) {
					return;
				}
				installingWorker.onstatechange = () => {
					if (installingWorker.state === "installed") {
						if (navigator.serviceWorker.controller) {
							// Execute callback
							if (config && config.onUpdate) {
								config.onUpdate(registration);
							}
						} else {
							// Execute callback
							if (config && config.onSuccess) {
								config.onSuccess(registration);
							}
						}
					}
				};
			};
		})
		.catch((error) => {
			console.error("Error during service worker registration:", error);
		});
}

const isSubscribeToPush = async () => {
	return navigator.serviceWorker
		.register("./service-worker.js")
		.then((registration) => {
			const applicationServerKey = process.env.REACT_APP_PUBLIC_KEY;
			const subscribeOptions = {
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
			};
			return registration.pushManager.subscribe(subscribeOptions);
		})
		.then((pushSubscription) => {
			return { pushSubscription: pushSubscription, isSubscribeToPush: true };
		})
		.catch((err) => {
			console.error(
				"Service Worker registration and subscription to push messages issue : ",
				err,
			);

			return { pushSubscription: null, isSubscribeToPush: false };
		});
};

export const subscribeToPushNotifications = async () => {
	return isSubscribeToPush()
		.then((subscribeTopushResponse) => {
			if (subscribeTopushResponse.isSubscribeToPush === false) {
				return false;
			}

			return sendSubscriptionToTheServer(
				subscribeTopushResponse.pushSubscription,
			);
		})
		.then((sendSubscriptionToTheServerResponse) => {
			if (sendSubscriptionToTheServerResponse === false) return false;
			return true;
		})
		.catch((err) => {
			console.error(
				"Error in granting permission for sending notifications : ",
				err,
			);
			return false;
		});
};

const sendSubscriptionToTheServer = async (subscriptionObject) => {
	let subscribedDeviceId = localStorage.getItem("deviceId");

	if (subscribedDeviceId == null) {
		console.error("subscribedDeviceId is null");
		return;
	}
	return await axios
		.post("/api/subscription/savesubscription", {
			body: { subscriptionObject, subscribedDeviceId },
			Headers: {
				"Content-type": "application/json",
			},
		})
		.then((response) => {
			return true;
		})
		.catch((err) => {
			console.error(
				"Error in sending subscription to the server from service registration file : ",
				err,
			);

			return false;
		});
};

function checkValidServiceWorker(swUrl, config) {
	// Check if the service worker can be found. If it can't reload the page.
	fetch(swUrl, {
		headers: { "Service-Worker": "script" },
	})
		.then((response) => {
			// Ensure service worker exists, and that we really are getting a JS file.
			const contentType = response.headers.get("content-type");
			if (
				response.status === 404 ||
				(contentType != null && contentType.indexOf("javascript") === -1)
			) {
				// No service worker found. Probably a different app. Reload the page.
				navigator.serviceWorker.ready.then((registration) => {
					registration.unregister().then(() => {
						window.location.reload();
					});
				});
			} else {
				// Service worker found. Proceed as normal.
				registerValidSW(swUrl, config);
			}
		})
		.catch(() => {
			console.error(
				"No internet connection found. App is running in offline mode.",
			);
		});
}

export function unregister() {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready
			.then((registration) => {
				registration.unregister();
			})
			.catch((error) => {
				console.error(error.message);
			});
	}
}

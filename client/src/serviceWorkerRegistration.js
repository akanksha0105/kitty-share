// // This optional code is used to register a service worker.
// // register() is not called by default.

// // This lets the app load faster on subsequent visits in production, and gives
// // it offline capabilities. However, it also means that developers (and users)
// // will only see deployed updates on subsequent visits to a page, after all the
// // existing tabs open on the page have been closed, since previously cached
// // resources are updated in the background.

// // To learn more about the benefits of this model and instructions on how to
// // opt-in, read https://cra.link/PWA

// import axios from "axios";

// const isLocalhost = Boolean(
// 	window.location.hostname === "localhost" ||
// 		// [::1] is the IPv6 localhost address.
// 		window.location.hostname === "[::1]" ||
// 		// 127.0.0.0/8 are considered localhost for IPv4.
// 		window.location.hostname.match(
// 			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
// 		),
// );

// const urlBase64ToUint8Array = (base64String) => {
// 	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
// 	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
// 	const rawData = atob(base64);
// 	const outputArray = new Uint8Array(rawData.length);
// 	for (let i = 0; i < rawData.length; ++i) {
// 		outputArray[i] = rawData.charCodeAt(i);
// 	}
// 	return outputArray;
// };

// const checkForServiceWorkerAndPushManager = () => {
// 	if (!("serviceWorker" in navigator)) {
// 		// throw new Error("No Service Worker support!");
// 		console.error("No Service Worker Support!");
// 		return false;
// 	}
// 	if (!("PushManager" in window)) {
// 		//throw new Error("No Push API Support!");
// 		console.error("No Push API Support!");
// 		return false;
// 	}
// 	return true;
// };

// const isSubscribeToPush = async () => {
// 	// The function will return Service Worker Registration Object

// 	return navigator.serviceWorker
// 		.register("./service-worker.js")
// 		.then((registration) => {
// 			console.log(
// 				"Service Worker successfully registered and the registration Object is : ",
// 				registration,
// 			);
// 			const applicationServerKey =
// 				"BHMKkSsulVHdqMkkdLM3wkbxA2_c7JV5oQ5f8WAiUHTrp_XrNgjQC5dA1HHSqrSTTGNOGrj_1V-qZ5lv8QAgrGc";
// 			const subscribeOptions = {
// 				userVisibleOnly: true,
// 				applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
// 			};
// 			return registration.pushManager.subscribe(subscribeOptions);
// 		})
// 		.then((pushSubscription) => {
// 			console.log(
// 				"Received PushSubscription: ",
// 				JSON.stringify(pushSubscription),
// 			);
// 			//return pushSubscription;

// 			return { pushSubscription: pushSubscription, isSubscribeToPush: true };
// 		})
// 		.catch((err) => {
// 			console.error(
// 				"Service Worker registration and subscription to push messages issue : ",
// 				err,
// 			);

// 			return { pushSubscription: null, isSubscribeToPush: false };
// 		});
// };

// const sendSubscriptionToTheServer = async (subscriptionObject) => {
// 	let subscribedDeviceId = localStorage.getItem("deviceId");
// 	console.log("subscribedDeviceId", subscribedDeviceId);

// 	if (subscribedDeviceId == null) {
// 		console.error("subscribedDeviceId is null");
// 		return;
// 	}
// 	return await axios
// 		.post("http://localhost:8080/api/subscription/savesubscription", {
// 			body: { subscriptionObject, subscribedDeviceId },
// 			Headers: {
// 				"Content-type": "application/json",
// 			},
// 		})
// 		.then((response) => {
// 			console.log(
// 				"Response receieved by sending subscription to the server : ",
// 				response.data.data,
// 			);

// 			return true;
// 		})
// 		.catch((err) => {
// 			console.error(
// 				"Error in sending subscription to the server from service registration file : ",
// 				err,
// 			);

// 			return false;
// 		});
// };

// export const main = async () => {
// 	console.log("In main function of service worker registration file ");

// 	const checkForServiceWorkerAndPushManagerResponse =
// 		checkForServiceWorkerAndPushManager();

// 	if (checkForServiceWorkerAndPushManagerResponse) {
// 		console.log(
// 			"checkForServiceWorkerAndPushManager Function Response : ",
// 			checkForServiceWorkerAndPushManagerResponse,
// 		);
// 		console.log("Service worker is present");
// 		localStorage.setItem("notificationsServicePossible", true);
// 	} else {
// 		console.log(
// 			" The current device will not be able to receive notifications since no service worker is present",
// 		);
// 		localStorage.setItem("notificationsServicePossible", false);
// 	}
// };

// export const subscribeToPushNotifications = async () => {
// 	console.log(
// 		"In subscribeToPushNotifications function of service worker registration file ",
// 	);

// 	return isSubscribeToPush()
// 		.then((subscribeTopushResponse) => {
// 			console.log("subscribetoPushResponse", subscribeTopushResponse);
// 			if (subscribeTopushResponse.isSubscribeToPush === false) {
// 				console.log("Unable to subscribe to push notifications");
// 				return false;
// 			}

// 			return sendSubscriptionToTheServer(
// 				subscribeTopushResponse.pushSubscription,
// 			);
// 		})
// 		.then((sendSubscriptionToTheServerResponse) => {
// 			console.log(
// 				"sendSubscriptionToTheServerResponse",
// 				sendSubscriptionToTheServerResponse,
// 			);

// 			if (sendSubscriptionToTheServer === false) return false;
// 			return true;
// 		})
// 		.catch((err) => {
// 			console.error(
// 				"Error in granting permission for sending notifications : ",
// 				err,
// 			);
// 			return false;
// 		});
// };

// export const unsubscribeTopushNotifications = async () => {
// 	return navigator.serviceWorker.ready.then(async (reg) => {
// 		// const pushSubscription = reg.pushManager.getSubscription();
// 		// console.log("unsubscription SUB", pushSubscription);

// 		return reg.pushManager
// 			.getSubscription()
// 			.then((pushSubscription) => {
// 				console.log(
// 					"pushSubscription object in serviceWorker registration file",
// 					pushSubscription,
// 				);

// 				return pushSubscription.unsubscribe();
// 			})
// 			.then((unsubscriptionToPushNotificationsResponse) => {
// 				console.log(
// 					"unsubscriptionToPushNotificationsResponse",
// 					unsubscriptionToPushNotificationsResponse,
// 				);
// 				console.log("Successfully unsubscribed");
// 				return true;
// 			})
// 			.catch((err) => {
// 				console.error("Unsubscription failed", err);
// 				return false;
// 			});
// 	});
// };

// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA
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
	console.log("config is : ", config);
	console.log("value of process.env.NODE_ENV :", process.env.NODE_ENV);
	console.log("Service worker present in : ", "serviceworker" in navigator);
	localStorage.setItem("notificationsServicePossible", true);
	if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
		// The URL constructor is available in all browsers that support SW.
		console.log("Production Loop1");
		const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
		console.log("publicURL", publicUrl);
		if (publicUrl.origin !== window.location.origin) {
			// Our service worker won't work if PUBLIC_URL is on a different origin
			// from what our page is served on. This might happen if a CDN is used to
			// serve assets; see https://github.com/facebook/create-react-app/issues/2374
			console.log("CDN used here");
			return;
		}

		window.addEventListener("load", () => {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
			console.log("swURL is: ", swUrl);

			if (isLocalhost) {
				// This is running on localhost. Let's check if a service worker still exists or not.
				checkValidServiceWorker(swUrl, config);

				// Add some additional logging to localhost, pointing developers to the
				// service worker/PWA documentation.
				navigator.serviceWorker.ready.then(() => {
					console.log(
						"This web app is being served cache-first by a service " +
							"worker. To learn more, visit https://cra.link/PWA",
					);
				});
			} else {
				// Is not localhost. Just register service worker
				registerValidSW(swUrl, config);
			}
		});
	}
}

function registerValidSW(swUrl, config) {
	console.log("Finally in registerValidSW");
	navigator.serviceWorker
		.register(swUrl)
		.then((registration) => {
			console.log("ServiceWorker is successfully registered:", registration);
			registration.onupdatefound = () => {
				const installingWorker = registration.installing;
				if (installingWorker == null) {
					return;
				}
				installingWorker.onstatechange = () => {
					if (installingWorker.state === "installed") {
						if (navigator.serviceWorker.controller) {
							// At this point, the updated precached content has been fetched,
							// but the previous service worker will still serve the older
							// content until all client tabs are closed.
							console.log(
								"New content is available and will be used when all " +
									"tabs for this page are closed. See https://cra.link/PWA.",
							);

							// Execute callback
							if (config && config.onUpdate) {
								config.onUpdate(registration);
							}
						} else {
							// At this point, everything has been precached.
							// It's the perfect time to display a
							// "Content is cached for offline use." message.
							console.log("Content is cached for offline use.");

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
	// The function will return Service Worker Registration Object

	return navigator.serviceWorker
		.register("./service-worker.js")
		.then((registration) => {
			console.log(
				"Service Worker successfully registered and the registration Object is : ",
				registration,
			);
			const applicationServerKey =
				"BHMKkSsulVHdqMkkdLM3wkbxA2_c7JV5oQ5f8WAiUHTrp_XrNgjQC5dA1HHSqrSTTGNOGrj_1V-qZ5lv8QAgrGc";
			const subscribeOptions = {
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
			};
			return registration.pushManager.subscribe(subscribeOptions);
		})
		.then((pushSubscription) => {
			console.log(
				"Received PushSubscription: ",
				JSON.stringify(pushSubscription),
			);
			//return pushSubscription;

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
	console.log(
		"In subscribeToPushNotifications function of service worker registration file ",
	);

	return isSubscribeToPush()
		.then((subscribeTopushResponse) => {
			console.log("subscribetoPushResponse", subscribeTopushResponse);
			if (subscribeTopushResponse.isSubscribeToPush === false) {
				console.log("Unable to subscribe to push notifications");
				return false;
			}

			return sendSubscriptionToTheServer(
				subscribeTopushResponse.pushSubscription,
			);
		})
		.then((sendSubscriptionToTheServerResponse) => {
			console.log(
				"sendSubscriptionToTheServerResponse",
				sendSubscriptionToTheServerResponse,
			);

			if (sendSubscriptionToTheServer === false) return false;
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
	console.log("subscribedDeviceId", subscribedDeviceId);

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
			console.log(
				"Response receieved by sending subscription to the server : ",
				response.data.data,
			);

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
			console.log(
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

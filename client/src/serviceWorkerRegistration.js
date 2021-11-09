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

const checkForServiceWorkerAndPushManager = () => {
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
	return true;
};

export const unsubscribeTopushNotifications = async () => {
	return navigator.serviceWorker.ready.then(async (reg) => {
		// const pushSubscription = reg.pushManager.getSubscription();
		// console.log("unsubscription SUB", pushSubscription);

		return reg.pushManager
			.getSubscription()
			.then((pushSubscription) => {
				console.log(
					"pushSubscription object in serviceWorker registration file",
					pushSubscription,
				);

				return pushSubscription.unsubscribe();
			})
			.then((unsubscriptionToPushNotificationsResponse) => {
				console.log(
					"unsubscriptionToPushNotificationsResponse",
					unsubscriptionToPushNotificationsResponse,
				);
				console.log("Successfully unsubscribed");
				return true;
			})
			.catch((err) => {
				console.error("Unsubscription failed", err);
				return false;
			});
	});
};

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

const sendSubscriptionToTheServer = async (subscriptionObject) => {
	let subscribedDeviceId = localStorage.getItem("deviceId");
	console.log("subscribedDeviceId", subscribedDeviceId);

	if (subscribedDeviceId == null) {
		console.error("subscribedDeviceId is null");
		return;
	}
	return await axios
		.post("http://localhost:8080/api/subscription/savesubscription", {
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

export const main = async () => {
	console.log("In main function of service worker registration file ");

	const checkForServiceWorkerAndPushManagerResponse =
		checkForServiceWorkerAndPushManager();

	if (checkForServiceWorkerAndPushManagerResponse) {
		console.log(
			"checkForServiceWorkerAndPushManager Function Response : ",
			checkForServiceWorkerAndPushManagerResponse,
		);
		console.log("Service worker is present");
		localStorage.setItem("notificationsServicePossible", true);
	} else {
		console.log(
			" The current device will not be able to receive notifications since no service worker is present",
		);
		localStorage.setItem("notificationsServicePossible", false);
	}
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

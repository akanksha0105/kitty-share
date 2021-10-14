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
import { v4 as uuidv4 } from "uuid";

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

const subscribeToPush = async () => {
	// The function will return Service Worker Registration Object
	return navigator.serviceWorker
		.register("./service-worker.js")
		.then((registration) => {
			console.log("Service Worker successfully registered.");
			console.log("Service Worker registration Object : ", registration);
			// return registration;
			const applicationServerKey =
				"BB2sJzqBookN3vwzqmF8a97ugLitJMqJ4zwio1G2WIbJhNXemBdk9DKiE-gItS0Ra7XBUVcp2zJnqK3qAuqViHQ";
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
			return pushSubscription;
		})
		.catch((err) => {
			console.error(
				"Service Worker registration and subscription to push messages issue : ",
				err,
			);
		});
};

const askPermissionForNotifications = async () => {
	return Notification.requestPermission()
		.then((result) => {
			console.log("Notification permission result : ", result);
			if (result !== "granted") {
				throw new Error("Permission for Notifications not granted : ");
			}
			return result;
		})
		.catch((err) => {
			console.error("Error in seeking notifications permission : ", err);
		});
};

const sendSubscriptionToTheServer = async (subscriptionObject) => {
	let subscribedDeviceId = localStorage.getItem("deviceId");
	console.log("subscribedDeviceId", subscribedDeviceId);
	return await axios
		.post("http://localhost:8080/api/subscription/savesubscription", {
			// body: JSON.stringify(subscription),
			// subscribedDeviceId,
			body: { subscriptionObject, subscribedDeviceId },
			Headers: {
				"Content-type": "application/json",
			},
			// body: subscription,
		})
		.then((response) => {
			console.log(
				"Response receieved by sending subscription to the server : ",
				response.data.data,
			);
		})
		.catch((err) => {
			console.error(
				"Error in sending subscription to the server from service registration file : ",
				err,
			);
		});
};

export const main = async () => {
	if (checkForServiceWorkerAndPushManager) {
		const notificationPermissionResult = await askPermissionForNotifications();
		console.log("notificationPermissionResult", notificationPermissionResult);

		const subscription = await subscribeToPush();
		console.log("subscribeToPushNotifications", subscription);

		const subscriptionSentToServer = await sendSubscriptionToTheServer(
			subscription,
		);
		console.log("subscriptionSentToServer", subscriptionSentToServer);
	}
};

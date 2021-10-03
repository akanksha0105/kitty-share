// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

import axios from 'axios';

const urlBase64ToUint8Array = (base64String) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

const checkForServiceWorkerAndPushManager = () => {
	if (!('serviceWorker' in navigator)) {
		// throw new Error("No Service Worker support!");
		console.error('No Service Worker Support!');
		return false;
	}
	if (!('PushManager' in window)) {
		//throw new Error("No Push API Support!");
		console.error('No Push API Support!');
		return false;
	}
	return true;
};

const subscribeToPush = async () => {
	// The function will return Service Worker Registration Object
	return navigator.serviceWorker
		.register('./service-worker.js')
		.then((registration) => {
			console.log('Service Worker successfully registered.');
			console.log('Service Worker registration Object : ', registration);
			// return registration;
			const applicationServerKey =
				'BB2sJzqBookN3vwzqmF8a97ugLitJMqJ4zwio1G2WIbJhNXemBdk9DKiE-gItS0Ra7XBUVcp2zJnqK3qAuqViHQ';
			const subscribeOptions = {
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
			};
			return registration.pushManager.subscribe(subscribeOptions);
		})
		.then((pushSubscription) => {
			console.log(
				'Received PushSubscription: ',
				JSON.stringify(pushSubscription),
			);
			return pushSubscription;
		})
		.catch((err) => {
			console.error(
				'Service Worker registration and subscription to push messages issue',
				err,
			);
		});
};

const askPermissionForNotifications = async () => {
	return Notification.requestPermission()
		.then((result) => {
			console.log('Notification permission result: ', result);
			if (result !== 'granted') {
				throw new Error('Permission for Notifications not granted');
			}
			return result;
		})
		.catch((err) => {
			console.error('Error in seeking notifications permission', err);
		});
};

const sendSubscriptionToTheServer = async (subscription) => {
	return await axios
		.post('http://localhost:8080/api/subscription/savesubscription', {
			body: JSON.stringify(subscription),
			Headers: {
				'Content-type': 'application/json',
			},
			// body: subscription,
		})
		.then((response) => {
			console.log(
				'Response receieved by sending subscription to the server',
				response,
			);
		})
		.catch((err) => {
			console.error(
				'Error in sending subscription to the server from service registration file',
				err,
			);
		});
};

export const main = async () => {
	if (checkForServiceWorkerAndPushManager) {
		const notificationPermissionResult = await askPermissionForNotifications();
		console.log('notificationPermissionResult', notificationPermissionResult);

		const subscription = await subscribeToPush();
		console.log('subscribeToPushNotifications', subscription);

		const subscriptionSentToServer = await sendSubscriptionToTheServer(
			subscription,
		);
		console.log('subscriptionSentToServer', subscriptionSentToServer);

		const sendNotificationToTheServerValue =
			await sendNotificationToTheServer();
		console.log(
			'sendNotificationToTheServer',
			sendNotificationToTheServerValue,
		);
	}
};

// const isLocalhost = Boolean(
//   window.location.hostname === "localhost" ||
//     // [::1] is the IPv6 localhost address.
//     window.location.hostname === "[::1]" ||
//     // 127.0.0.0/8 are considered localhost for IPv4.
//     window.location.hostname.match(
//       /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
//     )
// );

// export function register(config) {
//   // if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator){

//   if ("serviceWorker" in navigator) {
//     // The URL constructor is available in all browsers that support SW.
//     const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

//     console.log("test1", publicUrl, window.location.origin);
//     if (publicUrl.origin !== window.location.origin) {
//       console.log("return", publicUrl.origin, window.location.origin);

//       // Our service worker won't work if PUBLIC_URL is on a different origin
//       // from what our page is served on. This might happen if a CDN is used to
//       // serve assets; see https://github.com/facebook/create-react-app/issues/2374
//       return;
//     }

//     window.addEventListener("load", () => {
//       // const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
//       const swUrl = "http://localhost:8080/service-worker.js";
//       console.log("swURL", swUrl);
//       if (isLocalhost) {
//         console.log("localhost");
//         // This is running on localhost. Let's check if a service worker still exists or not.
//         checkValidServiceWorker(swUrl, config);

//         // Add some additional logging to localhost, pointing developers to the
//         // service worker/PWA documentation.
//         navigator.serviceWorker.ready.then(() => {
//           console.log(
//             "This web app is being served cache-first by a service " +
//               "worker. To learn more, visit https://cra.link/PWA"
//           );
//         });
//       } else {
//         // Is not localhost. Just register service worker
//         registerValidSW(swUrl, config);
//       }
//     });
//   }
// }

// function registerValidSW(swUrl, config) {
//   navigator.serviceWorker
//     .register(swUrl)
//     .then((registration) => {
//       console.log("Register 1");
//       registration.onupdatefound = () => {
//         const installingWorker = registration.installing;
//         if (installingWorker == null) {
//           return;
//         }
//         installingWorker.onstatechange = () => {
//           if (installingWorker.state === "installed") {
//             if (navigator.serviceWorker.controller) {
//               // At this point, the updated precached content has been fetched,
//               // but the previous service worker will still serve the older
//               // content until all client tabs are closed.
//               console.log(
//                 "New content is available and will be used when all " +
//                   "tabs for this page are closed. See https://cra.link/PWA."
//               );

//               // Execute callback
//               if (config && config.onUpdate) {
//                 config.onUpdate(registration);
//               }
//             } else {
//               // At this point, everything has been precached.
//               // It's the perfect time to display a
//               // "Content is cached for offline use." message.
//               console.log("Content is cached for offline use.");

//               // Execute callback
//               if (config && config.onSuccess) {
//                 config.onSuccess(registration);
//               }
//             }
//           }
//         };
//       };
//     })
//     .catch((error) => {
//       console.error("Error during service worker registration:", error);
//     });
// }

// function checkValidServiceWorker(swUrl, config) {
//   // Check if the service worker can be found. If it can't reload the page.
//   fetch(swUrl, {
//     headers: { "Service-Worker": "script" },
//   })
//     .then((response) => {
//       // Ensure service worker exists, and that we really are getting a JS file.
//       const contentType = response.headers.get("content-type");
//       console.log(
//         "valid check",
//         response.status,
//         contentType != null && contentType.indexOf("javascript") === -1,
//         contentType
//       );
//       if (
//         response.status === 404 ||
//         (contentType != null && contentType.indexOf("javascript") === -1)
//       ) {
//         // No service worker found. Probably a different app. Reload the page.
//         navigator.serviceWorker.ready.then((registration) => {
//           registration.unregister().then(() => {
//             window.location.reload();
//           });
//         });
//       } else {
//         // Service worker found. Proceed as normal.
//         console.log("valid, starting to register");
//         registerValidSW(swUrl, config);
//       }
//     })
//     .catch(() => {
//       console.log(
//         "No internet connection found. App is running in offline mode."
//       );
//     });
// }

// export function unregister() {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.ready
//       .then((registration) => {
//         registration.unregister();
//       })
//       .catch((error) => {
//         console.error(error.message);
//       });
//   }
// }

// export const requestNotificationPermission = async () => {
//   const permission = await window.Notification.requestPermission();
//   // value of permission can be 'granted', 'default', 'denied'
//   // granted: user has accepted the request
//   // default: user has dismissed the notification permission popup by clicking on x
//   // denied: user has denied the request.
//   if (permission !== "granted") {
//     throw new Error("Permission not granted for Notification");
//   }
//   return permission;
// };

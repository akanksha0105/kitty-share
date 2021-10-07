const express = require("express");
const router = express.Router();
const SubscriptionsModel = require("../models/subscriptionsModel");
var mongoose = require("mongoose");

const webpush = require("web-push");

router.get("/subscribeddevice/:deviceid", (req, res) => {
	console.log(
		"In susbscriptionsRoute.js for checking whether the receiver device is subscribed to notifications",
	);
	const device_id = req.params.deviceid;

	SubscriptionsModel.find({ deviceId: device_id })
		.then((subscriptionsModelResponse) => {
			console.log("subscriptionsModelResponse", subscriptionsModelResponse);

			if (subscriptionsModelResponse.length <= 0) {
				console.log("The receiver device is not subscribed to notifications");
				res.status(404).json({
					code: 102,
					message: "The receiver device is not subscribed to notifications",
				});
			}

			return res.status(200).json({
				code: 101,
				message: "The receiver's device is already subscribed to notifications",
			});
		})
		.catch((err) => {
			console.error(
				"Encountered problem on server side in checking the receiver's device validation of subscriptions Modal",
				err,
			);
			res.status(500).json({
				code: 101,
				message:
					"Encountered problem on server side in checking the receiver's device validation of subscriptions Modal ",
			});
		});
});

//Route Checked
router.post("/savesubscription", async (req, res) => {
	const subscription = req.body.body;
	console.log("Subscription at server", subscription);

	const searchedDeviceId = subscription.subscribedDeviceId;
	console.log("searchedDeviceEndpoint", searchedDeviceId);

	SubscriptionsModel.find({ deviceId: searchedDeviceId }).then(
		(subscriptionsModelRecord) => {
			console.log("subscriptionsModelRecord", subscriptionsModelRecord);
			if (subscriptionsModelRecord.length <= 0) {
				const newSubscription = new SubscriptionsModel({
					deviceId: subscription.subscribedDeviceId,
					subscriptionObject: {
						endpoint: subscription.subscriptionObject.endpoint,
						expirationTime: subscription.subscriptionObject.expirationTime,
						keys: {
							p256dh: subscription.subscriptionObject.keys.p256dh,
							auth: subscription.subscriptionObject.keys.auth,
						},
					},
				});

				return newSubscription
					.save()
					.then((record) => {
						console.log("Subscription saved in Database");
						console.log(record);
						res.status(200).json({
							data: record,
							message: "Subscription saved in Database",
						});
					})
					.catch((err) => {
						console.error(
							"Server unable to store the subscription object",
							err,
						);
						res.status(500).json({
							message: "Server unable to store the subscription object",
						});
					});
			}

			const newUpdatedSubscription = {
				expirationTime:
					subscriptionsModelRecord[0].subscriptionObject.expirationTime,
				keys: {
					p256dh: subscriptionsModelRecord[0].subscriptionObject.keys.p256dh,
					auth: subscriptionsModelRecord[0].subscriptionObject.keys.auth,
				},
			};

			const newValues = {
				expirationTime: subscription.subscriptionObject.expirationTime,
				keys: {
					p256dh: subscription.subscriptionObject.keys.p256dh,
					auth: subscription.subscriptionObject.keys.auth,
				},
			};

			return SubscriptionsModel.updateOne(newUpdatedSubscription, {
				$set: newValues,
			})
				.then((updatedSubscription) => {
					console.log(
						"Subscription model successfully updated",
						updatedSubscription,
					);
					res
						.status(200)
						.json({ data: "Subscription updated and saved in database" });
				})
				.catch((err) => {
					console.error("Unable to update SubscriptionModel", err);
					res.status(500).json({
						message:
							"Unable to update the subscription in Subscriptions database",
					});
				});
		},
	);
});

router.post("/sendnotification", async (req, res) => {
	console.log("Reaching send Notification route...");
	// console.log(req.body.currentDeviceId);
	console.log(req.body);
	const senderDeviceId = req.body.currentDeviceId.currentDeviceId;
	console.log(senderDeviceId);
	const receiverDeviceID = req.body.receiverDeviceID;
	const urlTobeShared = req.body.urlTobeShared.searchInput;

	const subscription = SubscriptionsModel.find({ deviceId: receiverDeviceID });
	subscription
		.then((subscriptionsModelRecord) => {
			console.log(
				"Response with respect to the request of receiver's device_id ",
				subscriptionsModelRecord,
			);

			//This block of syntax can be avoided
			if (subscriptionsModelRecord.length <= 0) {
				return res
					.status(404)
					.json({ message: "No receiver_id exists like this..." });
			}

			//console.log(subscriptionsModelRecord[0].subscriptionObject.endpoint);
			const pushSubscriptionObject = {
				endpoint: subscriptionsModelRecord[0].subscriptionObject.endpoint,
				expirationTime:
					subscriptionsModelRecord[0].subscriptionObject.expirationTime,
				keys: subscriptionsModelRecord[0].subscriptionObject.keys,
			};

			console.log(
				"pushSubscriptionObject in sendnotifications route",
				pushSubscriptionObject,
			);

			const payload = JSON.stringify({
				title: `Notification by ${senderDeviceId}`,
				content: urlTobeShared,
			});
			webpush
				.sendNotification(pushSubscriptionObject, payload)
				.then((webpushNotificationResponse) => {
					console.log("webpush Notification sent", webpushNotificationResponse);
					res.setHeader("Content-Type", "application/json");
					res.json({ message: "message sent" });
				})
				.catch((err) => {
					console.error("Error in webpush", err);
				});
		})
		.catch((err) => {
			console.error("Unable to fetch subscription from database", err);
		});
});

module.exports = router;

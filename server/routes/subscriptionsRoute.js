const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const SubscriptionsModel = require("../models/subscriptionsModel");
const TextCodeModel = require("../models/textCodeModel");
var mongoose = require("mongoose");

const webpush = require("web-push");
const { UUID } = require("bson");

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
				return res.status(404).json({
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
			return res.status(500).json({
				code: 101,
				message:
					"Encountered problem on server side in checking the receiver's device validation of subscriptions Modal ",
			});
		});
});

router.delete("/subscribeddevice/:subscriptionId", async (req, res) => {
	console.log("In delete subscription route");
	const subscriptionId = req.params.subscriptionId;
	console.log("subscriptionId", subscriptionId);
	SubscriptionsModel.findOneAndDelete({ deviceId: subscriptionId })
		.then((deletedSubscription) => {
			console.log(
				"Subscription deleted from the database",
				deletedSubscription,
			);

			if (deletedSubscription)
				return res.status(200).json({
					message: "subscription Deleted from the database",
					isSubscriptionDeleted: true,
				});

			return res.status(404).json({
				message: "Subscription not found",
				isSubscriptionDeleted: false,
			});
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({
				message: "Unable to delete the subscription from the database",
				isSubscriptionDeleted: false,
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
const validURL = (str) => {
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
};

const checkOrGenerateCodeForText = async (urlTobeShared) => {
	return TextCodeModel.find({ message: urlTobeShared })
		.then((messageFoundResponse) => {
			let generatedCode;
			console.log("messageFoundResponse : ", messageFoundResponse);
			if (messageFoundResponse.length > 0) {
				generatedCode = messageFoundResponse[0].code;
				return generatedCode;
			} else {
				generatedCode = uuidv4();
				console.log("newCode is", generatedCode);

				const newTextCode = new TextCodeModel({
					code: generatedCode,
					message: urlTobeShared,
				});

				return newTextCode
					.save()
					.then((newTextCodeSavedResponse) => {
						console.log("newTextCodeSavedResponse", newTextCodeSavedResponse);
						return generatedCode;
					})
					.catch((err) => {
						console.error("Error in newTextCodeSavedResponse ", err);
					});
			}
		})
		.catch((err) => {
			console.error("Error in messageFoundResponse ", err);
		});
};
router.post("/sendnotification", async (req, res) => {
	console.log("Reaching send Notification route...");
	// console.log(req.body.currentDeviceId);
	console.log(req.body);
	// const senderDeviceId = req.body.currentDeviceId.currentDeviceId;
	const senderDeviceId = req.body.currentDeviceId;
	const receiverDeviceID = req.body.receiverDeviceId;
	const urlTobeShared = req.body.urlTobeShared;
	const notificationSendingDevice = req.body.notificationSendingDevice;

	const subscription = SubscriptionsModel.find({ deviceId: receiverDeviceID });
	subscription
		.then((subscriptionsModelRecord) => {
			console.log(
				"Response with respect to the request of receiver's device_id ",
				subscriptionsModelRecord,
			);

			//This block of syntax can be avoided
			if (subscriptionsModelRecord.length <= 0) {
				// return res
				// 	.status(404)
				// 	.json({ message: "No receiver_id exists like this..." });

				return res
					.status(404)
					.json({ message: "No receiver_id exists like this...", sent: false });
			}

			//console.log(subscriptionsModelRecord[0].subscriptionObject.endpoint);
			const pushSubscriptionObject = {
				endpoint: subscriptionsModelRecord[0].subscriptionObject.endpoint,
				expirationTime:
					// subscriptionsModelRecord[0].subscriptionObject.expirationTime,
					null,
				keys: subscriptionsModelRecord[0].subscriptionObject.keys,
			};

			console.log(
				"pushSubscriptionObject in sendnotifications route",
				pushSubscriptionObject,
			);

			let newCode, isURL, payload;
			if (validURL(urlTobeShared) === true) {
				payload = JSON.stringify({
					title: `Notification by ${notificationSendingDevice}`,
					content: urlTobeShared,
					newCode: null,
					isURL: true,
				});

				return {
					payload: payload,
					pushSubscriptionObject: pushSubscriptionObject,
				};
			} else {
				isURL = false;

				return checkOrGenerateCodeForText(urlTobeShared).then(
					(checkOrGenerateCodeForTextResponse) => {
						console.log(
							"checkOrGenerateCodeForTextResponse",
							checkOrGenerateCodeForTextResponse,
						);

						payload = JSON.stringify({
							title: `Notification by ${notificationSendingDevice}`,
							content: urlTobeShared,
							newCode: checkOrGenerateCodeForTextResponse,
							isURL: false,
						});

						return {
							payload: payload,
							pushSubscriptionObject: pushSubscriptionObject,
						};
					},
				);
			}
		})
		.then((payloadResponse) => {
			// console.log("final newCode", newCode);

			console.log("payload with pushSubscriptionObject here", payloadResponse);

			let pushSubscriptionObject = payloadResponse.pushSubscriptionObject;
			let payload = payloadResponse.payload;
			webpush
				.sendNotification(pushSubscriptionObject, payload)
				.then((webpushNotificationResponse) => {
					console.log("webpush Notification sent", webpushNotificationResponse);
					res.setHeader("Content-Type", "application/json");
					// res.json({ message: "message sent" });
					res.status(200).json({ message: "message sent", sent: true });
				})
				.catch((err) => {
					console.error("Error in webpush", err);
					res.status(500).json({ message: "Error in webpush", sent: false });
				});
		})
		.catch((err) => {
			console.error("Unable to fetch subscription from database", err);
			res.status(500).json({
				message: "Unable to fetch subscription from database",
				sent: false,
			});
		});
});

module.exports = router;

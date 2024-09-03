const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const SubscriptionsModel = require("../models/subscriptionsModel");
const TextCodeModel = require("../models/textCodeModel");
var mongoose = require("mongoose");

const webpush = require("web-push");
const { UUID } = require("bson");
const RESPONSE_CODES = require("../constants/responseCodes");


//Router Checked and Refactored
router.get("/subscribeddevice/:deviceid", (req, res) => {

	const deviceId = req.params.deviceid;

	SubscriptionsModel.find({ deviceId: deviceId })
		.then((subscriptionsModelResponse) => {

			if (subscriptionsModelResponse.length <= 0) {
				return res.status(404).json({
					code: RESPONSE_CODES.CODE_NOT_FOUND,
					message: "The receiver device is not subscribed to notifications",
					subscribed: false,
				});
			}

			return res.status(200).json({
				code: RESPONSE_CODES.SUCCESS,
				message: "The receiver's device is already subscribed to notifications",
				subscribed: true,
			});
		})
		.catch((err) => {
			console.error(
				"Encountered problem on server side in checking the receiver's device validation of subscriptions Modal",
				err,
			);
			return res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				message:
					"Encountered problem on server side in checking the receiver's device validation of subscriptions Modal " || err,
				subscribed: false,
			});
		});
});

//Router Checked and Refactored
router.delete("/subscribeddevice/:subscriptionId", async (req, res) => {
	console.log("In delete subscription route to delete subscribed route");
	const subscriptionId = req.params.subscriptionId;

	SubscriptionsModel.findOneAndDelete({ deviceId: subscriptionId })
		.then((deletedSubscription) => {


			if (deletedSubscription)
				return res.status(200).json({
					code: RESPONSE_CODES.SUCCESS,
					message: "subscription Deleted from the database",
					isSubscriptionDeleted: true,
				});

			return res.status(404).json({
				code: RESPONSE_CODES.CODE_NOT_FOUND,
				message: "Subscription not found",
				isSubscriptionDeleted: false,
			});
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				message: "Unable to delete the subscription from the database",
				isSubscriptionDeleted: false,
			});
		});
});

//  TODO: need to check this route

router.post("/savesubscription", async (req, res) => {
	const subscription = req.body.body;

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
							code: RESPONSE_CODES.SUCCESS,
							data: record,
							message: "Subscription saved in Database",
						});
					})
					.catch((err) => {

						res.status(500).json({
							code: RESPONSE_CODES.SERVER_ERROR,
							data: {},
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

					res
						.status(200)
						.json({ code: RESPONSE_CODES.SUCCESS, message: "Subscription updated and saved in database" });
				})
				.catch((err) => {
					console.error("Unable to update SubscriptionModel", err);
					res.status(500).json({
						code: RESPONSE_CODES.SERVER_ERROR,
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

//Checked and Refactored
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
						return "";
					});
			}
		})
		.catch((err) => {
			console.error("Error in messageFoundResponse ", err);
		});
};

//Router Checked and Refactored
router.post("/sendnotification", async (req, res) => {

	const senderDeviceId = req.body.currentDeviceId;
	const receiverDeviceId = req.body.receiverDeviceId;
	const urlTobeShared = req.body.urlTobeShared;
	const notificationSendingDevice = req.body.notificationSendingDevice;

	const subscription = SubscriptionsModel.find({ deviceId: receiverDeviceId });
	subscription
		.then((subscriptionsModelRecord) => {
			if (subscriptionsModelRecord.length <= 0) {

				return res
					.status(404)
					.json({ code: RESPONSE_CODES.RESOURCE_NOT_FOUND, message: "No receiver_id exists like this", sent: false });
			}

			//console.log(subscriptionsModelRecord[0].subscriptionObject.endpoint);
			const pushSubscriptionObject = {
				endpoint: subscriptionsModelRecord[0].subscriptionObject.endpoint,
				expirationTime:
					// subscriptionsModelRecord[0].subscriptionObject.expirationTime,
					null,
				keys: subscriptionsModelRecord[0].subscriptionObject.keys,
			};


			let newCode, isURL, payload;
			if (validURL(urlTobeShared) === true) {
				payload = JSON.stringify({
					title: `Notification by ${notificationSendingDevice}`,
					content: urlTobeShared,
					newCode: null,
					isURL: true,
					// senderDeviceId: senderDeviceId,
				});

				return {
					payload: payload,
					pushSubscriptionObject: pushSubscriptionObject,
				};
			} else {
				isURL = false;

				return checkOrGenerateCodeForText(urlTobeShared).then(
					(checkOrGenerateCodeForTextResponse) => {

						payload = JSON.stringify({
							title: `Notification by ${notificationSendingDevice}`,
							content: urlTobeShared,
							newCode: checkOrGenerateCodeForTextResponse,
							isURL: false,
							// senderDeviceId: senderDeviceId,
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
					res.status(200).json({ code: RESPONSE_CODES.SUCCESS, message: "message sent", sent: true });
				})
				.catch((err) => {
					console.error("Error in webpush", err);
					res.status(500).json({ code: RESPONSE_CODES.SERVER_ERROR, message: "Error in webpush", sent: false });
				});
		})
		.catch((err) => {
			console.error("Unable to fetch subscription from database", err);
			res.status(500).json({
				code: RESPONSE_CODES.SERVER_ERROR,
				message: "Unable to fetch subscription from database",
				sent: false,
			});
		});
});

module.exports = router;

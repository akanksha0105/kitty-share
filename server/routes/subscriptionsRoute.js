const express = require('express');
const router = express.Router();
const SubscriptionsModel = require('../models/subscriptionsModel');
var mongoose = require('mongoose');

const webpush = require('web-push');

router.post('/savesubscription', async (req, res) => {
	const oldSubscription = req.body.body;
	console.log('old subscription', oldSubscription);
	const subscription = JSON.parse(oldSubscription);

	console.log('Subscription Object at server', subscription);

	const searchedDeviceEndpoint = subscription.endpoint;
	console.log('searchedDeviceEndpoint', searchedDeviceEndpoint);
	SubscriptionsModel.find({ endpoint: searchedDeviceEndpoint }).then(
		(response) => {
			if (response.length <= 0) {
				const newSubscription = new SubscriptionsModel({
					endpoint: subscription.endpoint,
					expirationTime: subscription.expirationTime,
					keys: {
						p256dh: subscription.keys.p256dh,
						auth: subscription.keys.auth,
					},
				});

				return newSubscription
					.save()
					.then((record) => {
						console.log('Subscription saved in Database');
						console.log(record);
						res.status(200).json({
							data: record,
							message: 'Subscription saved in Database',
						});
					})
					.catch((err) => {
						console.error(
							'Server unable to store the subscription object',
							err,
						);
						res.status(500).json({
							message: 'Server unable to store the subscription object',
						});
					});
			}

			const newUpdatedSubscription = {
				expirationTime: response.expirationTime,
				keys: {
					p256dh: response.keys.p256dh,
					auth: response.keys.auth,
				},
			};

			const newValues = {
				expirationTime: subscription.expirationTime,
				keys: {
					p256dh: subscription.keys.p256dh,
					auth: subscription.keys.auth,
				},
			};

			return SubscriptionsModel.updateOne(newUpdatedSubscription, {
				$set: newValues,
			})
				.then((updatedSubscription) => {
					console.log(
						'Subscription model successfully updated',
						updatedSubscription,
					);
					res
						.status(200)
						.json({ data: 'Subscription updated and saved in database' });
				})
				.catch((err) => {
					console.error('Unable to update SubscriptionModel', err);
					res.status(500).json({
						message:
							'Unable to update the subscription in Subscriptions database',
					});
				});
		},
	);
});

router.post('/sendnotification', async (req, res) => {
	console.log('Reaching send Notification route...');
	const senderDeviceId = req.body.currentDeviceId;
	const receiverDeviceID = req.body.receiverDeviceID;
	const urlTobeShared = req.body.urlTobeShared;

	const subscription = SubscriptionsModel.find({ deviceId: receiverDeviceID });
	subscription
		.then((subscriptionsModelRecord) => {
			console.log(
				"Response with respect to the request of receiver's device_id ",
				subscriptionsModelRecord,
			);

			if (subscriptionsModelRecord.length <= 0) {
				return res
					.status(404)
					.json({ message: 'No receiver_id exists like this...' });
			}

			const pushSubscriptionObject = {
				endpoint: subscriptionsModelRecord.endpoint,
				expirationTime: subscriptionsModelRecord.expirationTime,
				keys: subscriptionsModelRecord.keys,
			};

			console.log(
				'pushSubscriptionObject in sendnotifications route',
				pushSubscriptionObject,
			);

			const payload = JSON.stringify({
				title: `Notification by ${senderDeviceId}`,
				content: urlTobeShared,
			});
			webpush
				.sendNotification(pushSubscriptionObject, payload)
				.then((webpushNotificationResponse) => {
					console.log('webpush Notification sent', webpushNotificationResponse);
					res.setHeader('Content-Type', 'application/json');
					res.json({ message: 'message sent' });
				})
				.catch((err) => {
					console.error('Error in webpush', err);
				});
		})
		.catch((err) => {
			console.error('Unable to fetch subscription from database', err);
		});

	// subscription
	// 	.then((queryResults) => {
	// 		console.log('queryResults', queryResults);
	// 		const pushSubscriptionObject = {
	// 			endpoint: queryResults.endpoint,
	// 			expirationTime: queryResults.expirationTime,
	// 			keys: queryResults.keys,
	// 		};

	// 		console.log(
	// 			'pushSubscriptionObject in sendnotifications route',
	// 			pushSubscriptionObject,
	// 		);

	// 		const payload = JSON.stringify({ title: 'Your Push Payload Text' });
	// 		webpush
	// 			.sendNotification(pushSubscriptionObject, payload)
	// 			.then((webpushNotificationResponse) => {
	// 				console.log('webpush Notification sent', webpushNotificationResponse);
	// 				res.setHeader('Content-Type', 'application/json');
	// 				res.json({ message: 'message sent' });
	// 			})
	// 			.catch((err) => {
	// 				console.error('Error in webpush', err);
	// 			});
	// 	})
	// 	.catch((err) => {
	// 		console.error('Unable to fetch subscription from database', err);
	// 	});
});

module.exports = router;

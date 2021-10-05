const mongoose = require("mongoose");

const subscriptionsSchema = mongoose.Schema({
	deviceId: {
		type: String,
		unique: true,
		required: true,
	},

	subscriptionObject: {
		endpoint: {
			type: String,
			required: true,
		},

		expirationTime: {
			type: String,
		},

		keys: {
			p256dh: {
				type: String,
				required: true,
			},
			auth: {
				type: String,
				required: true,
			},
		},
	},
});

const Subscriptions = mongoose.model("Subscriptions", subscriptionsSchema);

module.exports = Subscriptions;

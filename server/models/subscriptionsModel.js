const mongoose = require("mongoose");

const subscriptionsSchema = mongoose.Schema({
  endpoint: {
    type: String,
    unique: true,
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
});

const Subscriptions = mongoose.model("Subscriptions", subscriptionsSchema);

module.exports = Subscriptions;

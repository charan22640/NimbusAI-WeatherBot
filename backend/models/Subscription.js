const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  location: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
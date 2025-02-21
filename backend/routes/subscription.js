const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Email sender configuration from env
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME;

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Add a cleanup function for unverified subscriptions
const cleanupUnverifiedSubscriptions = async (email) => {
  try {
    await Subscription.deleteMany({ 
      email, 
      isVerified: false,
      otpExpires: { $lt: Date.now() }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

router.post('/subscribe', async (req, res) => {
  const { email, location } = req.body;

  try {
    // Clean up expired unverified subscriptions
    await cleanupUnverifiedSubscriptions(email);

    // Check if email already exists and is verified
    const existingSubscription = await Subscription.findOne({ 
      email, 
      isVerified: true 
    });

    if (existingSubscription) {
      return res.status(400).json({ 
        error: 'This email is already subscribed for weather alerts.' 
      });
    }

    // Delete any unverified subscriptions for this email
    await Subscription.deleteMany({ 
      email, 
      isVerified: false 
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new subscription (unverified)
    const subscription = new Subscription({
      email,
      location,
      otp,
      otpExpires,
      isVerified: false
    });

    await subscription.save();
    
    // Send OTP email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Your Weather Alert Verification Code";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify Your Email Address</h2>
        <p>Your verification code for Weather Alert subscription is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #3B82F6; margin: 20px 0;">
          ${otp}
        </h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this subscription, you can ignore this email.</p>
      </div>
    `;
    sendSmtpEmail.sender = { 
      email: SENDER_EMAIL,
      name: SENDER_NAME 
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to process subscription' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  const { email, location, otp } = req.body;
  
  try {
    const subscription = await Subscription.findOne({
      email,
      location,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!subscription) {
      // Clean up expired unverified subscriptions
      await cleanupUnverifiedSubscriptions(email);
      return res.status(400).json({ 
        error: 'Invalid or expired verification code.' 
      });
    }

    // Mark as verified and save
    subscription.isVerified = true;
    subscription.otp = undefined;
    subscription.otpExpires = undefined;
    await subscription.save();

    // Delete any other unverified subscriptions for this email
    await Subscription.deleteMany({ 
      email, 
      _id: { $ne: subscription._id }, 
      isVerified: false 
    });

    // Send welcome email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Welcome to Weather Alert Service! 🌤️";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Weather Alert! 🌤️</h2>
        <p>Thank you for verifying your email address.</p>
        <p>You're now subscribed to receive emergency weather alerts for <strong>${location}</strong>.</p>
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">You will receive alerts for:</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 10px 0;">⚡ Severe Weather Warnings</li>
            <li style="margin: 10px 0;">🌪️ Emergency Weather Conditions</li>
            <li style="margin: 10px 0;">⛈️ Major Storm Alerts</li>
            <li style="margin: 10px 0;">🌊 Flash Flood Warnings</li>
          </ul>
          <p style="color: #dc2626; font-size: 0.875rem; margin-top: 10px;">
            Note: You will only receive emails when emergency weather conditions are predicted.
          </p>
        </div>
        <p>Stay safe and weather-ready!</p>
        <p style="color: #4b5563; font-size: 0.875rem; margin-top: 20px;">
          If you have any questions, just reply to this email.
        </p>
      </div>
    `;
    sendSmtpEmail.sender = { 
      email: SENDER_EMAIL,
      name: SENDER_NAME 
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({ 
      message: 'Successfully verified and subscribed.' 
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: 'Verification failed. Please try again.' 
    });
  }
});

module.exports = router;
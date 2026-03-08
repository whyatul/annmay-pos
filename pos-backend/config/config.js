require("dotenv").config();

const config = Object.freeze({
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  accessTokenSecret: process.env.JWT_SECRET,

  // Razorpay (legacy)
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpaySecretKey: process.env.RAZORPAY_KEY_SECRET,
  razorpyWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,

  // PhonePe
  phonePeMerchantId: process.env.PHONEPE_MERCHANT_ID,
  phonePeSaltKey: process.env.PHONEPE_SALT_KEY,
  phonePeSaltIndex: process.env.PHONEPE_SALT_INDEX || "1",
  phonePeRedirectUrl: process.env.PHONEPE_REDIRECT_URL || "http://localhost:5174",
  serverBaseUrl: process.env.SERVER_BASE_URL || "http://localhost:8000",
});

module.exports = config;

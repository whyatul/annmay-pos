const express = require("express");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { createOrder, verifyPayment, webHookVerification } = require("../controllers/paymentController");
const { initiatePayment, paymentCallback, checkStatus } = require("../controllers/phonePeController");

// Razorpay (legacy — requires auth)
router.route("/create-order").post(isVerifiedUser, createOrder);
router.route("/verify-payment").post(isVerifiedUser, verifyPayment);
router.route("/webhook-verification").post(webHookVerification);

// PhonePe (customer-facing — no auth required)
router.route("/phonepe/initiate").post(initiatePayment);
router.route("/phonepe/callback").post(paymentCallback);
router.route("/phonepe/status/:merchantTransactionId").get(checkStatus);

module.exports = router;
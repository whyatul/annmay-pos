const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

// Public endpoint for customer-facing app (no auth)
router.route("/customer").post(addOrder);

// Admin endpoints (require auth)
router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);

// Kitchen endpoints (no auth for local network kitchen app)
router.route("/kitchen/active").get(getOrders);
router.route("/kitchen/:id/status").put(updateOrder);

// Kitchen endpoints (no auth for local network kitchen app)
router.route("/kitchen/active").get(getOrders);
router.route("/kitchen/:id/status").put(updateOrder);

module.exports = router;
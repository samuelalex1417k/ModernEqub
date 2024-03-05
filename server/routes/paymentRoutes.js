const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  initiatePayment,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/:equbId/pay", protect, initiatePayment);
router.get("/verify-payment/:transactionId", verifyPayment);

module.exports = router;

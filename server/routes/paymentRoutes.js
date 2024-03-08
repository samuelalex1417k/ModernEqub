const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  initiatePayment,
  verifyPayment,
  getTransactionsByEqubAndRound,
  getUserTransactions,
} = require("../controllers/paymentController");

router.post("/:equbId/pay", protect, initiatePayment);
router.get("/verify-payment/:transactionId", verifyPayment);
router.get(
  "/:equbId/:roundNumber/transactions",
  protect,
  getTransactionsByEqubAndRound
);
router.get("/:userId/transactions", protect, getUserTransactions);

module.exports = router;

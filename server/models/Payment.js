const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  equb: {
    type: mongoose.Schema.ObjectId,
    ref: "Equb",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  paymentDate: {
    type: Date,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;

const User = require("../models/User");
const Equb = require("../models/Equb");
const Payment = require("../models/Payment");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const chapaConfig = require("../config/chapaConfig");

//@desc     Initiate Payment for equb
//@route    POST /api/payment/:equbId/pay
//@access   Private (User)
exports.initiatePayment = asyncHandler(async (req, res, next) => {
  const CALLBACK_URL = `http://localhost:5000/api/payment/verify-payment/`;

  const user = await User.findById(req.user._id);
  const equb = await Equb.findById(req.params.equbId);

  if (!user || !equb) {
    return res.status(404).json({ message: "User or EQUB not found" });
  }

  const TEXT_REF = `tx-${equb._id}-${Date.now()}`;
  console.log(TEXT_REF);

  const data = {
    amount: equb.amount,
    currency: "ETB",
    tx_ref: TEXT_REF,
    callback_url: CALLBACK_URL + TEXT_REF,
    meta: {
      equbId: req.params.equbId,
      userId: req.user._id,
    },
  };

  const response = await axios.post(process.env.CHAPA_URL, data, chapaConfig);
  res.json(response.data.data.checkout_url);
});

//@desc     Verify Payment
//@route    GET /api/payment/verify-payment/:transactionId
//@access   Public
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const transactionId = req.params.transactionId;

  const response = await axios.get(
    `https://api.chapa.co/v1/transaction/verify/${transactionId}`,
    chapaConfig
  );

  const { amount, currency, method, tx_ref, status } = response.data.data;

  const payment = new Payment({
    equb: response.data.data.meta.equbId,
    user: response.data.data.meta.userId,
    amount: Number(amount),
    currency: currency,
    paymentMethod: method,
    transactionId: tx_ref,
    status: status,
    paymentDate: Date.now(),
  });

  await payment.save();

  await User.findByIdAndUpdate(userId, { $push: { payments: payment._id } });

  await Equb.findByIdAndUpdate(equbId, { $push: { payments: payment._id } });

  res.status(200).json({ message: "Payment was successfully verified" });
});

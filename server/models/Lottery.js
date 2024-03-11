const mongoose = require("mongoose");

const lotterySchema = new mongoose.Schema({
  equb: {
    type: mongoose.Schema.ObjectId,
    ref: "Equb",
  },
  roundNumber: {
    type: Number,
  },
  previousWinners: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  winner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lottery = mongoose.model("Lottery", lotterySchema);

module.exports = Lottery;

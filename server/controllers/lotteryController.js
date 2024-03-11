const asyncHandler = require("express-async-handler");
const Equb = require("../models/Equb");
const Lottery = require("../models/Lottery");

// @desc    Hold lottery for a specific Equb
// @route   POST /api/lottery/:equbId/hold
// @access  Private
exports.holdLottery = asyncHandler(async (req, res, next) => {
  const equbId = req.params.equbId;

  const equb = await Equb.findById(equbId).populate("members");

  if (!equb) {
    return res.status(404).json({ message: "Equb not found" });
  }

  const currentRound = equb.current_round;
  const maxRound = equb.max_round;

  const existingLottery = await Lottery.findOne({
    equb: equbId,
    roundNumber: currentRound,
  });

  if (existingLottery) {
    return res.status(409).json({
      message: `Lottery already held for round ${currentRound}.`,
    });
  }

  let allPreviousWinners = [];
  for (let round = 1; round < currentRound; round++) {
    const previousWinners = await Lottery.findOne({
      equb: equbId,
      roundNumber: round,
    }).select("previousWinners");
    if (previousWinners) {
      allPreviousWinners = allPreviousWinners.concat(
        previousWinners.previousWinners
      );
    }
  }

  const filteredMembers = equb.members.filter(
    (member) =>
      !allPreviousWinners.some(
        (prevWinner) => prevWinner._id.toString() === member._id.toString()
      )
  );

  if (filteredMembers.length === 0) {
    return res.json({ message: `Equb round ${currentRound} is finished.` });
  }

  const winnerIndex = Math.floor(Math.random() * filteredMembers.length);
  const winner = filteredMembers[winnerIndex];

  const lottery = new Lottery({
    equb: equbId,
    roundNumber: currentRound,
    winner: winner._id,
    previousWinners: allPreviousWinners.concat(winner._id),
  });

  await lottery.save();

  const newRound = Math.min(currentRound + 1, maxRound);

  await Equb.findByIdAndUpdate(equbId, {
    current_round: newRound,
    $push: { lottery: lottery._id },
  });

  res.json({
    message: `Congratulations to ${winner.username}! You won the lottery for round ${currentRound}.`,
  });
});

//@desc     Get a winner
//@route    GET /api/lottery/:equbid/:roundnumber/winner
//@access   Private (Users)
exports.getWinner = asyncHandler(async (req, res, next) => {
  const equbId = req.params.equbId;
  const roundNumber = parseInt(req.params.roundNumber);

  const lottery = await Lottery.findOne({ equb: equbId, roundNumber }).populate(
    "winner"
  );

  if (!lottery) {
    return res.status(404).json({
      message: "Winner not found for the specified equb and round number.",
    });
  }

  res.json({ winner: lottery.winner });
});

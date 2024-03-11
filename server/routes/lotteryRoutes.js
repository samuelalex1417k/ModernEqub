const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { holdLottery, getWinner } = require("../controllers/lotteryController");

router.post("/:equbId/hold", protect, holdLottery);
router.get("/:equbId/:roundNumber/winner", protect, getWinner);

module.exports = router;

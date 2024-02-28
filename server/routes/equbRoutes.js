const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const {
  equbCreationValidation,
  validate,
} = require("../middlewares/validation");
const {
  createEqub,
  sendJoinRequest,
  getAllJoinRequests,
  acceptJoinRequest,
  declineJoinRequest,
  addUsersToEqub,
  removeUsersFromEqub,
  getEqubs,
  getEqub,
  getMyEqub,
  getJoinedEqubs,
  getNearbyEqubs,
  regenerateCode,
  updateEqub,
  authorizeEqub,
  leaveEqub,
  endEqub,
  deleteEqub,
} = require("../controllers/equbController");

// Equb related routes
router.post("/", protect, equbCreationValidation, validate, createEqub);
router.get("/", protect, admin, getEqubs);
router.get("/:id", protect, getEqub);
router.put("/:id", protect, updateEqub);
router.delete("/:id", protect, admin, deleteEqub);

// User related routes
router.get("/myequb", protect, getMyEqub);
router.get("/joined", protect, getJoinedEqubs);
router.get("/:latitude/:longitude/nearby", protect, getNearbyEqubs);
router.put("/:id/regenerate-code", protect, regenerateCode);
router.post("/:id/authorize", protect, admin, authorizeEqub);
router.post("/:id/addmember", protect, addUsersToEqub);
router.put("/:id/removemember", protect, removeUsersFromEqub);
router.post("/:id/sendjoinrequest", protect, sendJoinRequest);
router.get("/:id/joinrequests", protect, getAllJoinRequests);
router.put(
  "/:equbId/joinrequests/:requestId/accept",
  protect,
  acceptJoinRequest
);
router.put(
  "/:equbId/joinrequests/:requestId/decline",
  protect,
  declineJoinRequest
);
router.put("/:id/leave", protect, leaveEqub);
router.put("/:id/end", protect, endEqub);

module.exports = router;

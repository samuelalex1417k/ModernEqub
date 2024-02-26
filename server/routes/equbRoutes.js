const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const {
  equbCreationValidation,
  validate,
} = require("../middlewares/validation");
const {
  createEqub,
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

router
  .route("/")
  .post(protect, equbCreationValidation, validate, createEqub)
  .get(protect, admin, getEqubs);
router.get("/search", protect, getEqub);
router.get("/myequb", protect, getMyEqub);
router.get("/joined", protect, getJoinedEqubs);
router.get("/:latitude/:longitude/nearby", protect, getNearbyEqubs);
router.put("/:id/regenerate-code", protect, regenerateCode);
router.post("/:id/authorize", protect, admin, authorizeEqub);
router.post("/:id/addmember", protect, addUsersToEqub);
router.put("/:id/removemember", protect, removeUsersFromEqub);
router.put("/:id/leave", protect, leaveEqub);
router.put("/:id/end", protect, endEqub);
router
  .route("/:id")
  .put(protect, updateEqub)
  .delete(protect, admin, deleteEqub);

module.exports = router;

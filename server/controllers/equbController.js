const Equb = require("../models/Equb");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { generateEqubCode } = require("../utils/generatePassword");

// @desc    Create Equb
// @route   POST /api/equbs
// @access  Private (User)
exports.createEqub = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;

  const existingEqub = await Equb.findOne({ createdBy: req.user._id });
  if (existingEqub) {
    return res
      .status(401)
      .json({ message: "The user already created an equb" });
  }
  const equb = await Equb.create(req.body);
  await req.user.updateOne({ $push: { createdEqub: equb._id } });
  res.status(201).json(equb);
});

//@desc    Add members to the equb
//@route   PUT /api/equbs/:id/addmember
//@access  Private (User)
exports.addUsersToEqub = asyncHandler(async (req, res) => {
  const { phoneNumbers } = req.body;
  const equbId = req.params.id;
  const creatorId = req.user._id;

  const equb = await Equb.findById(equbId);
  if (!equb) {
    return res.status(404).json({ error: "Equb not found" });
  }

  if (!equb.isAuthorized) {
    return res
      .status(401)
      .json({ error: "Equb is not authorized for adding users" });
  }

  if (equb.createdBy.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Not authorized to add users" });
  }

  const validUsers = await Promise.all(
    phoneNumbers.map(async (phoneNumber) => {
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        throw new Error(`User with phone number '${phoneNumber}' not found`);
      }
      return user._id;
    })
  );

  const existingMembers = new Set(
    equb.members.map((memberId) => memberId.toString())
  );

  const newUsersToAdd = [...validUsers, creatorId].filter(
    (userId) => !existingMembers.has(userId.toString())
  );

  const updatedEqub = await Equb.findOneAndUpdate(
    { _id: equbId },
    { $push: { members: { $each: newUsersToAdd } } },
    { new: true, runValidators: true }
  );

  await Promise.all(
    newUsersToAdd.map(async (userId) => {
      if (userId.toString() !== creatorId.toString()) {
        await User.updateOne(
          { _id: userId },
          { $push: { joinedEqubs: equbId } }
        );
      }
    })
  );

  res.status(200).json(updatedEqub);
});

//@desc    Remove members from the equb
//@route   PUT /api/equbs/:id/removemember
//@access  Private (User)
exports.removeUsersFromEqub = asyncHandler(async (req, res) => {
  const { userIds } = req.body;
  const equbId = req.params.id;
  const creatorId = req.user._id;

  const equb = await Equb.findById(equbId);
  if (!equb) {
    return res.status(404).json({ error: "Equb not found" });
  }

  if (!equb.isAuthorized) {
    return res
      .status(401)
      .json({ error: "Equb is not authorized for removing users" });
  }

  if (equb.createdBy.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ error: "You are not authorized to remove users" });
  }

  if (userIds.includes(creatorId.toString())) {
    return res
      .status(400)
      .json({ error: "You cannot remove yourself from the equb" });
  }

  const existingMembers = new Set(
    equb.members.map((memberId) => memberId.toString())
  );

  const usersToRemove = userIds.filter((userId) =>
    existingMembers.has(userId.toString())
  );

  if (usersToRemove.length === 0) {
    return res.status(400).json({ error: "No valid users to remove" });
  }

  // Remove users from equb's members and user's joinedEqubs arrays
  const updatedEqub = await Equb.findOneAndUpdate(
    { _id: equbId },
    { $pull: { members: { $in: usersToRemove } } },
    { new: true }
  );

  await Promise.all(
    usersToRemove.map(async (userId) => {
      await User.updateOne({ _id: userId }, { $pull: { joinedEqubs: equbId } });
    })
  );

  res.status(200).json(updatedEqub);
});

//@desc    Get equb the user owns
//@rout    GET /api/equbs/my
//@access  Private (User)
exports.getMyEqub = asyncHandler(async (req, res) => {
  const equb = await Equb.findOne({ createdBy: req.user._id });
  if (!equb) {
    return res.status(404).json({ error: "Equb not found" });
  }

  res.status(200).json(equb);
});

//@desc    Get joined equbs of the current user
//@route   GET /api/equbs/joined
//@access  Private (User)
exports.getJoinedEqubs = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("joinedEqubs");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.joinedEqubs || user.joinedEqubs.length === 0) {
    return res.status(404).json({ message: "User has not joined any equb" });
  }

  const joinedEqubs = user.joinedEqubs;
  res.status(200).json({ joinedEqubs });
});

//@desc    Leave an equb
//@route   PUT /api/equbs/:id/leave
//@access  Private (User)
exports.leaveEqub = asyncHandler(async (req, res) => {
  const equbId = req.params.id;
  const userId = req.user._id;

  const equb = await Equb.findById(equbId);
  if (!equb) {
    return res.status(404).json({ error: "Equb not found" });
  }

  const isMember = equb.members.some((member) => member.equals(userId));
  if (!isMember) {
    return res.status(404).json({ error: "You are not a member of this equb" });
  }

  if (equb.createdBy.equals(userId)) {
    return res
      .status(400)
      .json({ error: "You cannot leave the equb as its creator" });
  }

  equb.members = equb.members.filter((member) => !member.equals(userId));

  await equb.save();

  await User.updateOne({ _id: userId }, { $pull: { joinedEqubs: equbId } });

  res.status(200).json({ message: "You have left the equb successfully" });
});

//@desc    End an equb
//@route   PUT /api/equbs/:id/end
//@access  Private (User)
exports.endEqub = asyncHandler(async (req, res) => {
  const equbId = req.params.id;
  const userId = req.user._id;

  const equb = await Equb.findById(equbId);
  if (!equb) {
    return res.status(404).json({ error: "Equb not found" });
  }

  if (!equb.createdBy.equals(userId)) {
    return res
      .status(401)
      .json({ error: "You are not authorized to end this equb" });
  }

  await User.updateOne({ _id: userId }, { createdEqub: null });

  equb.members = [];

  equb.createdBy = null;

  equb.status = "completed";

  await User.updateMany({}, { $pull: { joinedEqubs: equbId } });

  await User.updateOne({ _id: userId }, { $pull: { createdEqubs: equbId } });

  await equb.save();
  res.status(200).json({ message: "The equb has been ended successfully" });
});

// @desc    Update Equb
// @route   PUT /api/equbs/:id
// @access  Private
exports.updateEqub = asyncHandler(async (req, res) => {
  let equb = await Equb.findById(req.params.id);
  if (!equb) {
    return res.status(404).json({ error: "Equb not found" });
  }

  const user = await User.findById(req.user._id);
  if (
    !user ||
    (user.role !== "admin" && equb.createdBy.toString() !== req.user._id)
  ) {
    return res
      .status(401)
      .json({ error: "Not authorized to update this equb" });
  }

  equb = await Equb.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  await equb.save();
  res.status(200).json(equb);
});

// @desc    Regenerate Equb Code
// @route   PUT /api/equbs/:id/regenerate-code
// @access  Private (User)
exports.regenerateCode = asyncHandler(async (req, res) => {
  const equb = await Equb.findById(req.params.id);
  if (!equb) {
    return res.status(404).json({ error: "Equb not found" });
  }
  if (equb.createdBy.toString() !== req.user._id) {
    return res
      .status(401)
      .json({ error: "Not authorized to regenerate code for this equb" });
  }
  const newEqubCode = generateEqubCode();

  equb.equb_code = newEqubCode;
  await equb.save();
  res.status(200).json({ message: "Equb code changed successfully" });
});

// @desc    Get All Equbs
// @route   GET /api/equbs
// @access  Private (Admin)
exports.getEqubs = asyncHandler(async (req, res) => {
  const equbs = await Equb.find();
  if (!equbs) {
    return res.status(404).json({ message: "Equbs not found" });
  }
  res.status(200).json(equbs);
});

// @desc      Search equb
// @route     GET /api/equbs/search
// @access    Private (User)
exports.getEqub = asyncHandler(async (req, res, next) => {
  const equb_code = req.body.equb_code;
  const equb = await Equb.findOne({ equb_code });
  if (!equb) {
    return res.status(404).json({ message: "Equb not found" });
  }
  res.status(200).json(equb);
});

// @desc    Get Nearby Equbs in a specific area
// @route   GET /api/equbs/:latitude/:longitude/nearby
// @access  Private
exports.getNearbyEqubs = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.params;
  const userCoordinates = [parseFloat(latitude), parseFloat(longitude)];

  // Query nearby equbs using Mongoose's geospatial query
  const nearbyEqubs = await Equb.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: userCoordinates,
        },
        $maxDistance: process.env.MAX_DISTANCE,
      },
    },
  });
  res.status(200).json(nearbyEqubs);
});

// @desc     Delete Equb
// @route    DELETE /api/equbs/:id
// @access   Private (Admin)
exports.deleteEqub = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let equb = await Equb.findById(id);

  if (!equb) {
    return res.status(404).json({ message: "Equb not found" });
  }
  const user = await User.findById(req.user._id);
  if (
    !user ||
    (user.role !== "admin" && equb.createdBy.toString() !== req.user._id)
  ) {
    return res
      .status(401)
      .json({ error: "Not authorized to delete this equb" });
  }
  equb = await Equb.findOneAndDelete(id);
  res.status(200).json({ message: "Equb deleted successfully" });
});

// @desc     Authorize Equb
// @route    POST /api/equbs/:id/authorize
// @access   Private (Admin)
exports.authorizeEqub = asyncHandler(async (req, res) => {
  const equb = await Equb.findById(req.params.id);
  if (!equb) return res.status(404).json({ error: "Equb not found" });

  equb.isAuthorized = true;
  equb.status = "approved";
  await Promise.all([
    equb.save(),
    User.findByIdAndUpdate(equb.createdBy._id, { role: "manager" }),
  ]);

  res.status(200).json(equb);
});

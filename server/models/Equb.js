const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const equbSchema = new mongoose.Schema(
  {
    equb_code: {
      type: String,
    },
    equb_name: {
      type: String,
    },
    number_of_participant: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    type: {
      type: String,
    },
    starting_date: {
      type: Date,
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    max_round: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    joinRequests: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      },
    ],
    payments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Payment",
      },
    ],
    current_round: {
      type: Number,
      default: 1,
    },
    isAuthorized: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to generate equb_code and max_round
equbSchema.pre("save", function (next) {
  this.max_round = this.number_of_participant;

  if (!this.equb_code) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    this.equb_code = `E${randomDigits}`;
  }
  next();
});

// Geocode and create location field
equbSchema.pre("save", async function (next) {
  if (this.isNew) {
    const loc = await geocoder(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc.latitude, loc.longitude],
      formattedAddress: loc.formattedAddress,
      street: loc.street,
      city: loc.city,
      state: loc.state,
      zipcode: loc.zipcode,
      country: loc.country,
    };
    this.address = undefined;
  }
  next();
});

const Equb = mongoose.model("Equb", equbSchema);

module.exports = Equb;

import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  audience: {
    type: Number,
    default: 0,
  },
  sent: {
    type: Number,
    default: 0,
  },
  failed: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveryRate: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.models.Campaign ||
  mongoose.model("Campaign", CampaignSchema);

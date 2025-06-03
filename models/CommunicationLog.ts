import mongoose from "mongoose";

const CommunicationLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["sent", "failed", "pending"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CommunicationLog ||
  mongoose.model("CommunicationLog", CommunicationLogSchema);

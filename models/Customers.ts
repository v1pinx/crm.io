import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  totalSpent: { type: Number, default: 0 },
  lastVisit: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
export async function connectToMongoDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}


import { createClient } from "redis";
import Customers from "@/models/Customers";
import { connectToMongoDB } from "@/lib/mongodb";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

await connectToMongoDB();
while (true) {
  try {
    const response: any = await redis.xRead(
      { key: "customer:create", id: "$" }, 
      { BLOCK: 5000, COUNT: 1 }
    );

    if (response) {
      const entries = response[0].messages;
      for (const entry of entries) {
        const { name, email, phone } = entry.message;

        // Save to MongoDB
        const exists = await Customers.findOne({ email });
        if (!exists) {
          const customer = new Customers({ name, email, phone });
          await customer.save();
        } else {
        }
      }
    }
  } catch (error) {
    console.error("Error processing customer creation:", error);
  }
}

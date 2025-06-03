import { connectToMongoDB } from "@/lib/mongodb";
import Orders from "@/models/Orders";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();

    const totalOrders = await Orders.countDocuments({});

    return new NextResponse(JSON.stringify({ count : totalOrders }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching total orders:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch total orders" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

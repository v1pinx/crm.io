import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import Orders from "@/models/Orders";
import Customers from "@/models/Customers";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerId, amount, status, items, createdAt } = data;
    if (!customerId || !amount || !items || items.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Customer ID, amount, and items are required.",
        }),
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const newOrder = new Orders({
      customerId,
      amount,
      status: status || "pending",
      items,
      createdAt: createdAt || new Date(),
    });

    await newOrder.save();

    return new NextResponse(
      JSON.stringify({
        message: "Order created successfully",
        order: newOrder,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create order" }),
      { status: 500 }
    );
  }
}

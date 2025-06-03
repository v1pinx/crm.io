import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import Orders from "@/models/Orders";

export async function POST(request: NextRequest) {
  try {
    const orders = await request.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Expected a non-empty array of orders." }),
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Validate and prepare orders
    const invalidOrders = [];
    const preparedOrders = [];

    for (const order of orders) {
      const { customerId, amount, items, status, createdAt } = order;

      if (!customerId || !amount || !items || items.length === 0) {
        invalidOrders.push(order);
        continue;
      }

      preparedOrders.push({
        customerId,
        amount,
        items,
        status: status || "pending",
        createdAt: createdAt || new Date(),
      });
    }

    if (preparedOrders.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: "No valid orders to insert.",
          invalidOrders,
        }),
        { status: 400 }
      );
    }

    const insertedOrders = await Orders.insertMany(preparedOrders, {
      ordered: false,
    });

    return new NextResponse(
      JSON.stringify({
        message: "Orders inserted successfully",
        insertedCount: insertedOrders.length,
        orders: insertedOrders,
        invalidOrders,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting orders:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to insert orders" }),
      { status: 500 }
    );
  }
}

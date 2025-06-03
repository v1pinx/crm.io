import { connectToMongoDB } from "@/lib/mongodb";
import Customers from "@/models/Customers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToMongoDB();
    const totalCustomers = await Customers.countDocuments({});

    return new NextResponse(JSON.stringify({ count : totalCustomers }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching total customers:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch total customers" }),
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import Customers from "@/models/Customers";
import { connectToMongoDB } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();
    const data = await request.json();
    const { id, name, email, phone, totalSpent, lastVisit, visits, createdAt } = data;

    if (!name || !email || !phone) {
      return new NextResponse(
        JSON.stringify({ error: "Name, email, and phone are required." }),
        { status: 400 }
      );
    }

    const existingCustomer = await Customers.findOne({ email });
    if (existingCustomer) {
      return new NextResponse(
        JSON.stringify({ error: "Email already exists." }),
        { status: 400 }
      );
    }

    const newCustomer = new Customers({
      id: id || new Date().getTime().toString(),
      name,
      email,
      phone,
      totalSpent: totalSpent || 0,
      lastVisit: lastVisit || new Date(),
      visits: visits || 0,
      createdAt: createdAt || new Date(),
    });

    await newCustomer.save();
    return new NextResponse(
      JSON.stringify({
        message: "Customer created successfully",
        customer: newCustomer,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create customer" }),
      { status: 500 }
    );
  }
}

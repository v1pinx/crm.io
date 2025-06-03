import { NextRequest, NextResponse } from "next/server";
import Customers from "@/models/Customers";
import { connectToMongoDB } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();
    const customers = await request.json();

    if (!Array.isArray(customers)) {
      return new NextResponse(
        JSON.stringify({ error: "Expected an array of customer objects." }),
        { status: 400 }
      );
    }

    // Filter out customers missing required fields
    const invalid = customers.filter((c) => !c.name || !c.email || !c.phone);
    if (invalid.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: "Some customers are missing required fields.",
        }),
        { status: 400 }
      );
    }

    // Check for duplicates in the database (based on email)
    const emails = customers.map((c) => c.email);
    const existing = await Customers.find({ email: { $in: emails } });

    if (existing.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: "Some emails already exist.",
          existingEmails: existing.map((e) => e.email),
        }),
        { status: 400 }
      );
    }

    // Add default values and format customers
    const formattedCustomers = customers.map((c) => ({
      id:
        c.id ||
        new Date().getTime().toString() + Math.random().toString().slice(2, 6),
      name: c.name,
      email: c.email,
      phone: c.phone,
      totalSpent: c.totalSpent || 0,
      lastVisit: c.lastVisit || new Date(),
      visits: c.visits || 0,
      createdAt: c.createdAt || new Date(),
    }));

    const result = await Customers.insertMany(formattedCustomers, {
      ordered: false,
    });

    return new NextResponse(
      JSON.stringify({
        message: "Customers inserted successfully",
        insertedCount: result.length,
        customers: result,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting customers:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to insert customers" }),
      { status: 500 }
    );
  }
}

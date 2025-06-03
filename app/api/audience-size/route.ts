import { NextResponse } from "next/server";
import { calculateAudience } from "@/lib/helpers"; 
import { connectToMongoDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();

  await connectToMongoDB();
  const customers = await calculateAudience(body.segment);
  const size = customers.length;
  return NextResponse.json({ size });
}

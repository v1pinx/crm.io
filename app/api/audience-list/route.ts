import { NextResponse } from "next/server";
import { calculateAudience } from "@/lib/helpers"; 
import { connectToMongoDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();

  await connectToMongoDB();
  const customers = await calculateAudience(body.segment);
  const audienceList = customers.map((customer: any) => customer._id);
  const size = audienceList.length;

  return NextResponse.json({ audienceList, size });
}

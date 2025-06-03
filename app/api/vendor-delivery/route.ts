import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const success = Math.random() < 0.9;
  const status = success ? "sent" : "failed";
  setTimeout(async () => {
    await axios.post(`${process.env.BASE_URL}/api/delivery-receipt`, {
      campaignId: body.campaignId,
      customerId: body.customerId,
      status,
    });
  }, Math.random() * 1000);

  return new NextResponse(
    JSON.stringify({ message: "Dispatched to delivery receipt" }),
    { status: 200 }
  );
}

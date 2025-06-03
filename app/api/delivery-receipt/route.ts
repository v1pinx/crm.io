import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import CommunicationLog from "@/models/CommunicationLog";
import Campaign from "@/models/Campaigns";

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();

    const { campaignId, customerId, status } = await request.json();
   

    if (!campaignId || !customerId || !["sent", "failed"].includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400 }
      );
    }

    // Update the communication log entry
    await CommunicationLog.findOneAndUpdate(
      { campaignId, customerId },
      { status }
    );

    // Count updated stats
    const [sent, failed] = await Promise.all([
      CommunicationLog.countDocuments({ campaignId, status: "sent" }),
      CommunicationLog.countDocuments({ campaignId, status: "failed" }),
    ]);

    const total = sent + failed;
    const deliveryRate = total > 0 ? Math.round((sent / total) * 100) : 0;

    // Update campaign
    await Campaign.findByIdAndUpdate(campaignId, {
      sent,
      failed,
      deliveryRate,
      ...(total === (await CommunicationLog.countDocuments({ campaignId })) && {
        status: "completed",
      }),
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Delivery receipt error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process receipt" }),
      { status: 500 }
    );
  }
}

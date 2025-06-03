import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaigns";
import CommunicationLog from "@/models/CommunicationLog";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, audience, message, audienceList, createdBy } =
      body;

    if (
      !name ||
      !description ||
      !audience ||
      !message ||
      !Array.isArray(audienceList)
    ) {
      return new NextResponse(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    await connectToMongoDB();
    const newCampaign = new Campaign({
      name,
      description,
      audience,
      message,
      userId: createdBy,
    });
    const savedCampaign = await newCampaign.save();

    const logs = audienceList.map((customerId: string) => ({
      campaignId: savedCampaign._id,
      customerId,
      message: `Hi ${customerId}, ${message}`,
    }));
    await CommunicationLog.insertMany(logs);

    for (const log of logs) {
      axios.post(`${process.env.BASE_URL}/api/vendor-delivery`, log, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify(savedCampaign), { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create campaign" }),
      { status: 500 }
    );
  }
}
type ExtendedUser = {
  name?: string | null;
  email?: string | null;
  _id?: string;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as ExtendedUser;

    await connectToMongoDB();
    const campaigns = await Campaign.find({
      userId: user?._id,
    }).lean();
    return new NextResponse(JSON.stringify(campaigns), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch campaigns" }),
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getSubscribers } from "@/utils/subscribersStore";

export async function GET() {
  try {
    const subscribers = getSubscribers();
    const active = subscribers.filter((s) => s.status === "active");
    const unsubscribed = subscribers.filter((s) => s.status === "unsubscribed");

    return NextResponse.json({
      success: true,
      subscribers,
      stats: {
        total: subscribers.length,
        active: active.length,
        unsubscribed: unsubscribed.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

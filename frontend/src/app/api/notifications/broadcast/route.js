import { NextResponse } from "next/server";
import { getNotificationLogs } from "@/utils/subscribersStore";
import { broadcastNotification } from "@/utils/mailer";

export async function GET() {
  try {
    const logs = getNotificationLogs();
    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch notification logs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type = "announcement", data, title, message, actionUrl, actionText } = body;

    let payload = data;
    if (!payload && (title || message)) {
      payload = {
        title: title || "New Update from TecJob",
        message: message || "",
        actionUrl: actionUrl || "",
        actionText: actionText || "View on TecJob",
      };
    }

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Missing notification data payload." },
        { status: 400 }
      );
    }

    const broadcastResult = await broadcastNotification({
      type,
      data: payload,
    });

    return NextResponse.json({
      success: true,
      message: `Notification broadcast sent to ${broadcastResult.sentCount} of ${broadcastResult.totalSubscribers} subscribers.`,
      result: broadcastResult,
    });
  } catch (error) {
    console.error("Broadcast notification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to broadcast notification" },
      { status: 500 }
    );
  }
}

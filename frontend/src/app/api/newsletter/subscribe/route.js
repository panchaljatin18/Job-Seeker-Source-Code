import { NextResponse } from "next/server";
import { addSubscriber, getSubscribers } from "@/utils/subscribersStore";
import { sendWelcomeNotification } from "@/utils/mailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, preferences } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const { subscriber, isNew, reactivated } = addSubscriber(trimmedEmail, preferences);

    // Send welcome confirmation email
    let mailResult = null;
    let mailError = null;

    try {
      mailResult = await sendWelcomeNotification(trimmedEmail);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
      mailError = err.message;
    }

    let message = "🎉 Thank you for subscribing! You'll now receive email notifications for new jobs, companies, and updates.";
    if (!isNew && !reactivated) {
      message = "You are already subscribed to TecJob notifications! We sent a fresh confirmation to your email.";
    } else if (reactivated) {
      message = "Welcome back! Your subscription to TecJob notifications has been reactivated.";
    }

    return NextResponse.json({
      success: true,
      message,
      email: trimmedEmail,
      isNew,
      mailDelivered: !!mailResult?.success,
      previewUrl: mailResult?.previewUrl || null,
      isTestAccount: mailResult?.isTest || false,
    });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const subscribers = getSubscribers();
  const activeCount = subscribers.filter((s) => s.status === "active").length;
  return NextResponse.json({
    total: subscribers.length,
    active: activeCount,
  });
}

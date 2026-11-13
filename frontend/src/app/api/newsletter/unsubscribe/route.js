import { NextResponse } from "next/server";
import { unsubscribeUser } from "@/utils/subscribersStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse("Invalid request: email parameter missing", { status: 400 });
  }

  unsubscribeUser(email);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Unsubscribed from TecJob</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          max-width: 480px;
          width: 100%;
          padding: 40px 32px;
          text-align: center;
        }
        .icon {
          width: 56px;
          height: 56px;
          background: #FEF2F2;
          color: #EF4444;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        h1 { font-size: 22px; color: #0F172A; margin: 0 0 10px 0; }
        p { color: #64748B; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; }
        .btn {
          display: inline-block;
          background: #2563EB;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✉️</div>
        <h1>You've been unsubscribed</h1>
        <p><strong>${email}</strong> has been removed from TecJob notification emails. You will no longer receive job alerts or updates.</p>
        <a href="/" class="btn">Return to Homepage</a>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }
    const result = unsubscribeUser(email);
    return NextResponse.json({ success: true, message: "Unsubscribed successfully", updated: result });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to unsubscribe" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      return new NextResponse("Invalid email preview identifier.", { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src", "data", "email_previews", `${id}.html`);
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Email preview not found or has expired.", { status: 404 });
    }

    const htmlContent = fs.readFileSync(filePath, "utf8");
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("Preview email error:", err);
    return new NextResponse("Error reading email preview", { status: 500 });
  }
}

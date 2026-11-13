import { NextResponse } from "next/server";
import { jobsData } from "@/data/jobs";
import { getDynamicJobs, addDynamicJob } from "@/utils/subscribersStore";
import { broadcastNotification } from "@/utils/mailer";

export async function GET() {
  try {
    const dynamicJobs = getDynamicJobs();
    const allJobs = [...dynamicJobs, ...jobsData];
    return NextResponse.json({
      success: true,
      jobs: allJobs,
      total: allJobs.length,
      dynamicCount: dynamicJobs.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, company, location, salary, workType, tags, description, notifySubscribers = true } = body;

    if (!title || !company) {
      return NextResponse.json(
        { success: false, message: "Job title and company name are required." },
        { status: 400 }
      );
    }

    const newJob = addDynamicJob({
      title,
      company,
      location: location || "Remote",
      salary: salary || "Negotiable",
      workType: workType || "Full Time",
      tags: tags || ["Hiring", "Tech"],
      description: description || "",
    });

    let notificationResult = null;
    if (notifySubscribers) {
      try {
        notificationResult = await broadcastNotification({
          type: "new_job",
          data: newJob,
        });
      } catch (notifErr) {
        console.error("Job post created, but failed to broadcast notifications:", notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Job posted successfully!",
      job: newJob,
      notificationSent: !!notificationResult?.success,
      subscribersNotified: notificationResult?.sentCount || 0,
      previewUrl: notificationResult?.previewUrl || null,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, message: "Failed to post job." },
      { status: 500 }
    );
  }
}

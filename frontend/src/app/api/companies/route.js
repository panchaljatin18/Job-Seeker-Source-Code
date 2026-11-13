import { NextResponse } from "next/server";
import { companiesData } from "@/data/companies";
import { getDynamicCompanies, addDynamicCompany } from "@/utils/subscribersStore";
import { broadcastNotification } from "@/utils/mailer";

export async function GET() {
  try {
    const dynamicCompanies = getDynamicCompanies();
    const allCompanies = [...dynamicCompanies, ...companiesData];
    return NextResponse.json({
      success: true,
      companies: allCompanies,
      total: allCompanies.length,
      dynamicCount: dynamicCompanies.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, industry, location, website, about, openJobs = 1, notifySubscribers = true } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Company name is required." },
        { status: 400 }
      );
    }

    const newCompany = addDynamicCompany({
      name,
      industry: industry || "Technology",
      location: location || "India",
      website: website || "https://tecjob.com",
      about: about || `${name} is now hiring on TecJob! Check out the open positions.`,
      openJobs: Number(openJobs) || 1,
    });

    let notificationResult = null;
    if (notifySubscribers) {
      try {
        notificationResult = await broadcastNotification({
          type: "new_company",
          data: newCompany,
        });
      } catch (notifErr) {
        console.error("Company created, but failed to broadcast notifications:", notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Company added successfully!",
      company: newCompany,
      notificationSent: !!notificationResult?.success,
      subscribersNotified: notificationResult?.sentCount || 0,
      previewUrl: notificationResult?.previewUrl || null,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add company." },
      { status: 500 }
    );
  }
}

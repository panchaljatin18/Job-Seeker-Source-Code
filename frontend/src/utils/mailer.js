import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { getSubscribers, logNotification } from "./subscribersStore";

let cachedTestAccount = null;

const previewDir = path.join(process.cwd(), "src", "data", "email_previews");

function ensurePreviewDir() {
  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
  }
}

function saveLocalEmailPreview(subject, html, recipient) {
  try {
    ensurePreviewDir();
    const id = `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const filePath = path.join(previewDir, `${id}.html`);
    fs.writeFileSync(filePath, html, "utf8");
    const baseUrl = getBaseUrl();
    return `${baseUrl}/api/newsletter/preview?id=${id}`;
  } catch (err) {
    console.error("Failed to save local email preview:", err);
    return null;
  }
}

async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const secure = process.env.SMTP_SECURE === "true";

  // 1. If real SMTP credentials are provided, use them directly
  if (user && pass) {
    return {
      transporter: nodemailer.createTransport({
        host: host || "smtp.gmail.com",
        port,
        secure,
        auth: { user, pass },
      }),
      from: process.env.SMTP_FROM || `TecJob Alerts <${user}>`,
      isTest: false,
    };
  }

  // 2. Check if we already have a cached ethereal test account
  if (cachedTestAccount) {
    return {
      transporter: nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: cachedTestAccount.user,
          pass: cachedTestAccount.pass,
        },
      }),
      from: '"TecJob Alerts" <notifications@tecjob.com>',
      isTest: true,
    };
  }

  // 3. Try to create test account with a fast 2.5s timeout, else use local mock
  try {
    const testAccountPromise = nodemailer.createTestAccount();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Ethereal creation timed out")), 2500)
    );

    cachedTestAccount = await Promise.race([testAccountPromise, timeoutPromise]);
    console.log("Created Nodemailer Ethereal test account:", cachedTestAccount.user);

    return {
      transporter: nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: cachedTestAccount.user,
          pass: cachedTestAccount.pass,
        },
      }),
      from: '"TecJob Alerts" <notifications@tecjob.com>',
      isTest: true,
    };
  } catch (err) {
    // Graceful fallback to local JSON/Mock transport
    return {
      transporter: nodemailer.createTransport({ jsonTransport: true }),
      from: '"TecJob Alerts" <notifications@tecjob.com>',
      isTest: true,
      useLocalPreview: true,
    };
  }
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// 1. Welcome / Confirmation Email Template
export function generateWelcomeEmail(email) {
  const baseUrl = getBaseUrl();
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

  const subject = "🎉 Welcome to TecJob Notifications! You're Subscribed";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background: #0F172A; padding: 32px 30px; text-align: center;">
                  <div style="display: inline-block; background: #2563EB; color: #ffffff; font-weight: 800; font-size: 20px; border-radius: 10px; width: 44px; height: 44px; line-height: 44px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
                    💼
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
                    Tec<span style="color: #3B82F6;">Job</span>
                  </h1>
                  <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 13px;">Instant Job & Career Notifications</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 36px 32px;">
                  <span style="display: inline-block; padding: 5px 12px; background: #EFF6FF; color: #2563EB; font-size: 12px; font-weight: 700; border-radius: 20px; margin-bottom: 16px; border: 1px solid #DBEAFE;">
                    ✓ SUBSCRIPTION CONFIRMED
                  </span>
                  <h2 style="margin: 0 0 16px 0; color: #0F172A; font-size: 22px; font-weight: 800; line-height: 1.3;">
                    Welcome to the TecJob Community! 🚀
                  </h2>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                    Hello there,
                  </p>
                  <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                    You have successfully subscribed with <strong>${email}</strong>. Whenever exciting new opportunities arise, you'll be among the first to know!
                  </p>

                  <div style="background: #F1F5F9; border-radius: 12px; padding: 20px; margin-bottom: 28px; border-left: 4px solid #2563EB;">
                    <h3 style="margin: 0 0 12px 0; color: #0F172A; font-size: 15px; font-weight: 700;">
                      What notifications you will receive:
                    </h3>
                    <ul style="margin: 0; padding-left: 18px; color: #334155; font-size: 14px; line-height: 1.8;">
                      <li><strong>🔥 New Job Openings:</strong> Instant alerts whenever new tech, design, marketing, and developer jobs are posted.</li>
                      <li><strong>🏢 New Companies:</strong> Get notified when top companies, startups, and MNCs join TecJob.</li>
                      <li><strong>📢 Career Tips & Updates:</strong> Expert resume advice, hiring drives, and platform updates.</li>
                    </ul>
                  </div>

                  <!-- CTAs -->
                  <div style="text-align: center; margin-bottom: 20px;">
                    <a href="${baseUrl}/jobs" style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); margin-right: 10px; margin-bottom: 10px;">
                      Explore Open Jobs →
                    </a>
                    <a href="${baseUrl}/companies" style="display: inline-block; background: #F8FAFC; color: #0F172A; text-decoration: none; padding: 13px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; border: 1px solid #CBD5E1;">
                      Browse Companies
                    </a>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background: #F8FAFC; padding: 24px 30px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8; font-size: 12px; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">You received this email because you subscribed to notifications on TecJob.</p>
                  <p style="margin: 0;">
                    <a href="${unsubscribeUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe from alerts</a> • 
                    <a href="${baseUrl}" style="color: #2563EB; text-decoration: none;">Visit Website</a>
                  </p>
                  <p style="margin: 8px 0 0 0; color: #CBD5E1;">© ${new Date().getFullYear()} TecJob. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
}

// 2. New Job Notification Email Template
export function generateNewJobEmail(job, email) {
  const baseUrl = getBaseUrl();
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
  const jobUrl = `${baseUrl}/jobs`;

  const tagsList = Array.isArray(job.tags) ? job.tags : (job.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
  const subject = `🎯 New Job Alert: ${job.title} at ${job.company}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background: #0F172A; padding: 26px 30px;">
                  <table width="100%">
                    <tr>
                      <td>
                        <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">
                          Tec<span style="color: #3B82F6;">Job</span>
                        </span>
                      </td>
                      <td align="right">
                        <span style="background: #1E293B; color: #38BDF8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid #334155;">
                          NEW JOB ALERT
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 32px 30px;">
                  <h2 style="margin: 0 0 6px 0; color: #0F172A; font-size: 24px; font-weight: 800;">
                    ${job.title}
                  </h2>
                  <p style="margin: 0 0 20px 0; color: #2563EB; font-size: 16px; font-weight: 600;">
                    @ ${job.company}
                  </p>

                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                      <tr>
                        <td width="30%" style="color: #64748B; font-weight: 600;">📍 Location:</td>
                        <td style="color: #0F172A; font-weight: 700;">${job.location || "Remote"} (${job.locationType || "Full Time"})</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; font-weight: 600;">💰 Salary:</td>
                        <td style="color: #10B981; font-weight: 700;">${job.salary || "Best in Industry"}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; font-weight: 600;">⏰ Job Type:</td>
                        <td style="color: #0F172A; font-weight: 600;">${job.workType || "Full Time"}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; font-weight: 600;">🎓 Experience:</td>
                        <td style="color: #0F172A; font-weight: 600;">${job.experience || "Freshers / Experienced"}</td>
                      </tr>
                    </table>

                    ${
                      tagsList.length > 0
                        ? `
                      <div style="margin-top: 14px; padding-top: 14px; border-top: 1px dashed #CBD5E1;">
                        <span style="font-size: 12px; color: #64748B; font-weight: 600; display: block; margin-bottom: 6px;">Skills / Tags:</span>
                        <div>
                          ${tagsList
                            .map(
                              (tag) =>
                                `<span style="display: inline-block; background: #EFF6FF; color: #1D4ED8; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 6px; margin-right: 6px; margin-bottom: 4px; border: 1px solid #BFDBFE;">${tag}</span>`
                            )
                            .join("")}
                        </div>
                      </div>
                    `
                        : ""
                    }
                  </div>

                  ${
                    job.description
                      ? `
                    <div style="margin-bottom: 24px;">
                      <h4 style="margin: 0 0 8px 0; color: #0F172A; font-size: 14px; font-weight: 700;">About this role:</h4>
                      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">${job.description}</p>
                    </div>
                  `
                      : ""
                  }

                  <div style="text-align: center; margin: 30px 0 10px 0;">
                    <a href="${jobUrl}" style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                      View & Apply on TecJob →
                    </a>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background: #F8FAFC; padding: 20px 30px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8; font-size: 12px;">
                  <p style="margin: 0 0 6px 0;">You received this job notification because you subscribed to TecJob alerts.</p>
                  <p style="margin: 0;">
                    <a href="${unsubscribeUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a> • 
                    <a href="${baseUrl}" style="color: #2563EB; text-decoration: none;">TecJob Platform</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
}

// 3. New Company Added Email Template
export function generateNewCompanyEmail(company, email) {
  const baseUrl = getBaseUrl();
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
  const companyUrl = `${baseUrl}/companies/${company.slug || ""}`;

  const subject = `🏢 New Company Joined: Welcome ${company.name} to TecJob!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background: #0F172A; padding: 26px 30px;">
                  <table width="100%">
                    <tr>
                      <td>
                        <span style="color: #ffffff; font-size: 20px; font-weight: 900;">
                          Tec<span style="color: #3B82F6;">Job</span>
                        </span>
                      </td>
                      <td align="right">
                        <span style="background: #1E293B; color: #A78BFA; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid #334155;">
                          NEW COMPANY
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 32px 30px;">
                  <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; text-align: center; background: #EFF6FF; color: #2563EB; font-size: 22px; font-weight: 800; border-radius: 12px; margin-right: 14px; border: 1px solid #BFDBFE;">
                      ${company.logoText || (company.name ? company.name.charAt(0) : "C")}
                    </div>
                    <div>
                      <h2 style="margin: 0; color: #0F172A; font-size: 24px; font-weight: 800;">
                        ${company.name}
                      </h2>
                      <span style="color: #64748B; font-size: 13px; font-weight: 500;">
                        ${company.industry || "Technology"} • ${company.location || "India"}
                      </span>
                    </div>
                  </div>

                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                    ${company.about || `${company.name} has just registered on TecJob and is looking for talented professionals to join their growing team!`}
                  </p>

                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                    <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                      <tr>
                        <td width="35%" style="color: #64748B; font-weight: 600;">🏢 Industry:</td>
                        <td style="color: #0F172A; font-weight: 600;">${company.industry || "Technology"}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; font-weight: 600;">📍 Headquarters:</td>
                        <td style="color: #0F172A; font-weight: 600;">${company.location || "Multiple Locations"}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748B; font-weight: 600;">💼 Open Positions:</td>
                        <td style="color: #2563EB; font-weight: 700;">${company.openJobs || 1} Active Openings</td>
                      </tr>
                      ${
                        company.website
                          ? `
                        <tr>
                          <td style="color: #64748B; font-weight: 600;">🌐 Website:</td>
                          <td><a href="${company.website}" style="color: #2563EB; text-decoration: none;">${company.website}</a></td>
                        </tr>
                      `
                          : ""
                      }
                    </table>
                  </div>

                  <div style="text-align: center; margin: 26px 0 10px 0;">
                    <a href="${companyUrl}" style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                      View Company Profile & Jobs →
                    </a>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background: #F8FAFC; padding: 20px 30px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8; font-size: 12px;">
                  <p style="margin: 0 0 6px 0;">You received this notification because you subscribed to TecJob company updates.</p>
                  <p style="margin: 0;">
                    <a href="${unsubscribeUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a> • 
                    <a href="${baseUrl}" style="color: #2563EB; text-decoration: none;">TecJob Platform</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
}

// 4. General Announcement / Platform Update Template
export function generateAnnouncementEmail({ title, message, actionUrl, actionText }, email) {
  const baseUrl = getBaseUrl();
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
  const finalActionUrl = actionUrl || baseUrl;
  const subject = `📢 TecJob Update: ${title}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background: #0F172A; padding: 26px 30px;">
                  <span style="color: #ffffff; font-size: 20px; font-weight: 900;">
                    Tec<span style="color: #3B82F6;">Job</span>
                  </span>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 34px 30px;">
                  <span style="display: inline-block; padding: 5px 12px; background: #ECFDF5; color: #059669; font-size: 11px; font-weight: 700; border-radius: 20px; margin-bottom: 16px; border: 1px solid #A7F3D0;">
                    PLATFORM ANNOUNCEMENT
                  </span>
                  <h2 style="margin: 0 0 16px 0; color: #0F172A; font-size: 22px; font-weight: 800;">
                    ${title}
                  </h2>
                  <div style="color: #475569; font-size: 15px; line-height: 1.7; margin-bottom: 28px; white-space: pre-line;">
                    ${message}
                  </div>

                  <div style="text-align: center; margin: 26px 0 10px 0;">
                    <a href="${finalActionUrl}" style="display: inline-block; background: #2563EB; color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                      ${actionText || "Read More on TecJob →"}
                    </a>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background: #F8FAFC; padding: 20px 30px; border-top: 1px solid #E2E8F0; text-align: center; color: #94A3B8; font-size: 12px;">
                  <p style="margin: 0 0 6px 0;">You received this platform update because you are subscribed to TecJob alerts.</p>
                  <p style="margin: 0;">
                    <a href="${unsubscribeUrl}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a> • 
                    <a href="${baseUrl}" style="color: #2563EB; text-decoration: none;">TecJob Platform</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
}

// Generic mail sender with automatic fallback preview
export async function sendEmail({ to, subject, html, text }) {
  const { transporter, from, isTest, useLocalPreview } = await getTransporter();

  const mailOptions = {
    from,
    to,
    subject,
    html,
    text: text || subject,
  };

  let previewUrl = null;

  try {
    const info = await transporter.sendMail(mailOptions);
    if (isTest && !useLocalPreview && nodemailer.getTestMessageUrl) {
      previewUrl = nodemailer.getTestMessageUrl(info);
    }
  } catch (err) {
    console.warn("Transporter send error, saving to local preview fallback:", err.message);
  }

  // Always generate local preview URL if no external ethereal URL was generated
  if (!previewUrl) {
    previewUrl = saveLocalEmailPreview(subject, html, to);
  }

  return {
    success: true,
    previewUrl,
    isTest: !!isTest,
  };
}

// Send welcome email to a single new subscriber
export async function sendWelcomeNotification(email) {
  try {
    const { subject, html } = generateWelcomeEmail(email);
    const result = await sendEmail({ to: email, subject, html });

    logNotification({
      type: "welcome",
      subject,
      recipient: email,
      recipientsCount: 1,
      status: "sent",
      previewUrl: result.previewUrl,
      isTest: result.isTest,
    });

    return result;
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error);
    logNotification({
      type: "welcome",
      subject: "Welcome to TecJob Notifications!",
      recipient: email,
      recipientsCount: 1,
      status: "failed",
      error: error.message,
    });
    throw error;
  }
}

// Broadcast notification to ALL active subscribers
export async function broadcastNotification({ type, data }) {
  const allSubscribers = getSubscribers();
  const activeSubscribers = allSubscribers.filter(
    (s) => s.status === "active"
  );

  if (activeSubscribers.length === 0) {
    return {
      success: true,
      sentCount: 0,
      totalSubscribers: 0,
      message: "No active subscribers found to notify.",
    };
  }

  const results = [];
  const errors = [];
  let broadcastSubject = "";
  let lastPreviewUrl = null;

  for (const subscriber of activeSubscribers) {
    try {
      let emailContent;
      if (type === "new_job") {
        emailContent = generateNewJobEmail(data, subscriber.email);
      } else if (type === "new_company") {
        emailContent = generateNewCompanyEmail(data, subscriber.email);
      } else {
        emailContent = generateAnnouncementEmail(data, subscriber.email);
      }

      broadcastSubject = emailContent.subject;
      const sendResult = await sendEmail({
        to: subscriber.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      if (sendResult.previewUrl) {
        lastPreviewUrl = sendResult.previewUrl;
      }

      results.push({ email: subscriber.email, previewUrl: sendResult.previewUrl });
    } catch (err) {
      console.error(`Error sending email to ${subscriber.email}:`, err);
      errors.push({ email: subscriber.email, error: err.message });
    }
  }

  // Record summary log
  logNotification({
    type,
    subject: broadcastSubject,
    recipientsCount: activeSubscribers.length,
    successCount: results.length,
    failureCount: errors.length,
    status: errors.length === 0 ? "sent" : results.length > 0 ? "partial" : "failed",
    details: data,
    previewUrl: lastPreviewUrl,
  });

  return {
    success: true,
    totalSubscribers: activeSubscribers.length,
    sentCount: results.length,
    failedCount: errors.length,
    previewUrl: lastPreviewUrl,
    results,
    errors,
  };
}

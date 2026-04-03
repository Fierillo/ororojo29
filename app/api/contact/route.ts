import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminData } from "@/lib/data";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminData: any = await getAdminData();
    const contactEmail = adminData?.contactEmail || "contacto@ororojo29.com";

    // Only send if API key exists
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Oro Rojo 29 <onboarding@resend.dev>", // Change verified domain later
        to: contactEmail,
        subject: `New contact message from ${data.name}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `,
      });
    } else {
      console.warn("RESEND_API_KEY is not defined. Email simulated:");
      console.log({
        from: data.email,
        to: contactEmail,
        message: data.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Error processing the message" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminData } from "@/lib/data";
import { AdminData, ContactFormData } from "@/lib/types";

function sanitizeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });
    
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_attempts (
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW);
    const result = await pool.query(
      `SELECT COUNT(*) as attempts FROM contact_attempts 
       WHERE ip_address = $1 AND created_at > $2`,
      [ip, windowStart]
    );
    
    const attempts = parseInt(result.rows[0].attempts);
    
    if (attempts < MAX_ATTEMPTS) {
      await pool.query('INSERT INTO contact_attempts (ip_address) VALUES ($1)', [ip]);
      await pool.end();
      return true;
    }
    
    await pool.end();
    return false;
  } catch (error) {
    console.error('Rate limit error:', error);
    return true; // Fail open to not block users if DB is down
  }
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429 }
      );
    }
    
    const data: ContactFormData = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Campos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Sanitize input to prevent XSS
    const sanitizedName = sanitizeHTML(data.name.trim().slice(0, 100));
    const sanitizedEmail = sanitizeHTML(data.email.trim().slice(0, 100));
    const sanitizedPhone = sanitizeHTML((data.phone || '').trim().slice(0, 20));
    const sanitizedMessage = sanitizeHTML(data.message.trim().slice(0, 2000));

    const adminData: AdminData = await getAdminData();
    const contactEmail = adminData?.contactEmail || "contacto@ororojo29.com";

    // Only send if API key exists
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Oro Rojo 29 <onboarding@resend.dev>",
        to: contactEmail,
        subject: `New contact message from ${sanitizedName}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Phone:</strong> ${sanitizedPhone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedMessage}</p>
        `,
      });
    } else {
      console.warn("RESEND_API_KEY is not defined. Email simulated:");
      console.log({
        from: sanitizedEmail,
        to: contactEmail,
        message: sanitizedMessage,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
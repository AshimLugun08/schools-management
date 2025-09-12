import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Insert OTP into database
    await pool.query(
      "INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)",
      [email, otp, expiresAt]
    );

    // Send email
    await sendMail(
      email,
      "Your OTP Code",
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${email}`,
      otp, // keep for testing, remove in production
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP", error: error.message },
      { status: 500 }
    );
  }
}

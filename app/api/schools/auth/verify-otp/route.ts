import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { createToken } from "@/lib/auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()",
      [email, otp]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    await pool.query("DELETE FROM otps WHERE email = $1", [email]);

    const token = createToken(email);

   return NextResponse.json({
  message: "OTP verified",
  token,
  email, 
});

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}

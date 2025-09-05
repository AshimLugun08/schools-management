// app/api/schools/get/route.ts
import { NextResponse } from "next/server";
import pool, { initializeDatabase } from "@/lib/db";

export async function GET() {
  try {
    await initializeDatabase();

    // Fetch all schools
    const schools = await pool.query(`
      SELECT id, name, address, city, state, contact, email_id, image, created_at
      FROM schools
      ORDER BY created_at DESC
    `);

    // Count unique cities
    const cityCountRes = await pool.query(`
      SELECT COUNT(DISTINCT city) AS cities_covered FROM schools
    `);

    const totalSchools = schools.rowCount;
    const activeSchools = totalSchools; // For now, same as total
    const citiesCovered = cityCountRes.rows[0].cities_covered;

    return NextResponse.json({
      success: true,
      data: schools.rows,
      stats: {
        totalSchools,
        activeSchools,
        citiesCovered,
      },
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch schools",
      },
      { status: 500 }
    );
  }
}

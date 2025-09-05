// app/api/schools/get/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name, address, city, state, contact, email_id, image, created_at, active
      FROM schools
      ORDER BY created_at DESC
    `);

    const schools = result.rows;

    // Calculate stats
    const totalSchools = schools.length;
    const activeSchools = schools.filter((s) => s.active).length; // assumes "active" is a boolean column
    const citiesCovered = new Set(schools.map((s) => s.city)).size;

    return NextResponse.json({
      success: true,
      data: schools,
      stats: {
        totalSchools,
        activeSchools,
        citiesCovered,
      },
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

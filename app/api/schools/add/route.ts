// app/api/schools/add/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { schoolSchema } from "@/lib/validations/school";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      contact: formData.get("contact") as string,
      email_id: formData.get("email_id") as string,
      image: formData.get("image") as File,
    };

    // Convert File to FileList-like object for validation
    const imageFileList = {
      0: data.image,
      length: 1,
      item: (index: number) => (index === 0 ? data.image : null),
      [Symbol.iterator]: function* () {
        yield data.image;
      },
    } as FileList;

    const validationData = {
      ...data,
      image: imageFileList,
    };

    // Validate data with Zod schema
    const validatedData = schoolSchema.parse(validationData);

    // Check if email already exists
    const client = await pool.connect();
    const existingSchool = await client.query(
      "SELECT id FROM schools WHERE email_id = $1",
      [validatedData.email_id]
    );

    if (existingSchool.rows.length > 0) {
      client.release();
      return NextResponse.json(
        { success: false, error: "A school with this email already exists" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const imageBuffer = Buffer.from(await data.image.arrayBuffer());
    const cloudinaryResult = await uploadToCloudinary(imageBuffer, "schools") as { secure_url: string };

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    // Insert school record
    const insertResult = await client.query(
      `INSERT INTO schools 
        (name, address, city, state, contact, email_id, image) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
      [
        validatedData.name,
        validatedData.address,
        validatedData.city,
        validatedData.state,
        validatedData.contact,
        validatedData.email_id,
        cloudinaryResult.secure_url,
      ]
    );
    client.release();

    return NextResponse.json({
      success: true,
      data: insertResult.rows[0],
      message: "School added successfully",
    });
  } catch (error) {
    console.error("Error adding school:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add school",
      },
      { status: 500 }
    );
  }
}

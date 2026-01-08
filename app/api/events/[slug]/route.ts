import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";

// Shape of the dynamic route params for this route.
type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};
// Normalize and validate a slug value from the request.
const normalizeSlug = (rawSlug: unknown): string => {
  if (typeof rawSlug !== "string" || rawSlug.trim().length === 0) {
    throw new Error("Invalid slug. Slug must be a non-empty string.");
  }

  return rawSlug.trim().toLowerCase();
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    let tempSlug = await params;
    console.log("context, ", tempSlug);
    const slug = normalizeSlug(tempSlug.slug);

    // Ensure a single, shared DB connection instance.
    await connectToDatabase();

    // Use lean() for a plain JS object, better performance for read-only APIs.
    const event = await Event.findOne({ slug }).lean().exec();

    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    // Distinguish between validation errors and unexpected server errors.
    if (error instanceof Error && error.message.startsWith("Invalid slug")) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Optionally log error here with a logging service.
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

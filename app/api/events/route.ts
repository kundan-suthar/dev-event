import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formdata = await req.formData();
    let event;
    try {
      event = Object.fromEntries(formdata.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "invalid json data format" },
        { status: 400 }
      );
    }
    const file = formdata.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }
    let tags = JSON.parse(formdata.get("tags") as string);
    let agenda = JSON.parse(formdata.get("agenda") as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });
    event.image = (uploadResult as { secure_url: string }).secure_url;
    const createdEvent = await Event.create({ ...event, tags, agenda });
    return NextResponse.json(
      { message: "Event Created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed.",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      {
        message: "Events fetched successfully,",
        events,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}

// a route that accepts a slug as input and returns the event details

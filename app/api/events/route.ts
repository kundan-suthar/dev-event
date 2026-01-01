import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    try {
    await connectDB();
    const formdata = await req.formData();
    let event;
        try {
            event  = Object.fromEntries(formdata.entries())
        } catch (error) {
            return NextResponse.json({message:'invalid json data format'}, {status:400})
        } 
    const createdEvent = await Event.create(event)
    return NextResponse.json({message:'Event Created successfully', event:createdEvent}, {status:201})    
    } catch (e) {
        console.log(e);
        return NextResponse.json({message: 'Event Creation Failed.', error:e instanceof Error? e.message:'Unknown'},{status:500})
    }
}
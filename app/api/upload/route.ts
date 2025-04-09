import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "File must be an image" },
                { status: 400 }
            );
        }

        // Generate a unique filename
        const filename = `${nanoid()}-${file.name}`;

        // Upload to blob storage
        const blob = await put(filename, file, {
            access: 'public',
        });

        return NextResponse.json({
            url: blob.url,
            key: filename
        });
    } catch (error: any) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: error.message || "Error uploading file" },
            { status: 500 }
        );
    }
} 
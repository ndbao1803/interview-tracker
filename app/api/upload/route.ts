import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        
        // Convert file to base64 for storage
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // Store in database
        const companyId = formData.get("companyId") as string;
        if (companyId) {
            await prisma.companies.update({
                where: { id: companyId },
                data: {
                    logo_url: dataUrl,
                    logo_key: filename
                }
            });
        }

        return NextResponse.json({
            url: dataUrl,
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
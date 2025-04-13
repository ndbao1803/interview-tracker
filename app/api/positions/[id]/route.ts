import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const positionId = params.id;

    if (!positionId) {
      return NextResponse.json(
        { error: "Position ID is required" },
        { status: 400 }
      );
    }

    const position = await prisma.positions.findUnique({
      where: {
        id: positionId,
      },
      include: {
        companies: true,
      },
    });

    if (!position) {
      return NextResponse.json(
        { error: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(position);
  } catch (error) {
    console.error("Error fetching position:", error);
    return NextResponse.json(
      { error: "Failed to fetch position" },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scenarios = await prisma.scenario.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: scenarios,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/scenarios] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "シナリオ一覧の取得に失敗しました。",
        },
      },
      { status: 500 },
    );
  }
}



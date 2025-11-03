import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// GET /api/deal-statuses - 案件ステータス一覧取得
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const statuses = await prisma.dealStatus.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(statuses);
  } catch (error) {
    console.error("Error fetching deal statuses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/deal-statuses - 案件ステータス作成
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, order } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "ステータス名は必須です" },
        { status: 400 }
      );
    }

    // orderが指定されていない場合は最後尾に設定
    let orderValue = order;
    if (orderValue === undefined || orderValue === null) {
      const maxOrder = await prisma.dealStatus.aggregate({
        _max: { order: true },
      });
      orderValue = (maxOrder._max.order ?? -1) + 1;
    }

    const status = await prisma.dealStatus.create({
      data: {
        name: name.trim(),
        order: orderValue,
      },
    });

    return NextResponse.json(status, { status: 201 });
  } catch (error) {
    console.error("Error creating deal status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


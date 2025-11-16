import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET /api/business-plans/sales-plans?businessId=&scenarioCode=&fiscalYear=
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const scenarioCode = searchParams.get("scenarioCode");
    const fiscalYear = searchParams.get("fiscalYear");

    if (!businessId || !scenarioCode || !fiscalYear) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "businessId, scenarioCode, fiscalYear は必須です。" },
        },
        { status: 400 },
      );
    }

    const scenario = await prisma.scenario.findUnique({
      where: { code: scenarioCode },
    });

    if (!scenario) {
      return NextResponse.json(
        { success: false, error: { message: "指定されたシナリオが存在しません。" } },
        { status: 404 },
      );
    }

    const businessPlan = await prisma.businessPlan.findUnique({
      where: {
        businessId_scenarioId_fiscalYear: {
          businessId,
          scenarioId: scenario.id,
          fiscalYear: Number(fiscalYear),
        },
      },
    });

    if (!businessPlan) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const plans = await prisma.salesPlan.findMany({
      where: { businessPlanId: businessPlan.id },
      orderBy: [{ productId: "asc" }, { month: "asc" }],
    });

    return NextResponse.json({ success: true, data: plans }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/business-plans/sales-plans] Error:", error);
    return NextResponse.json(
      { success: false, error: { message: "商材別売上計画の取得に失敗しました。" } },
      { status: 500 },
    );
  }
}

type SaveRow = {
  productId: string;
  months: { month: number; amount: number | null }[];
};

// POST /api/business-plans/sales-plans
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
    }

    const body = await request.json();
    const { businessId, scenarioCode, fiscalYear, rows } = body as {
      businessId: string;
      scenarioCode: string;
      fiscalYear: number;
      rows: SaveRow[];
    };

    if (!businessId || !scenarioCode || !fiscalYear) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "businessId, scenarioCode, fiscalYear は必須です。" },
        },
        { status: 400 },
      );
    }

    const scenario = await prisma.scenario.findUnique({
      where: { code: scenarioCode },
    });

    if (!scenario) {
      return NextResponse.json(
        { success: false, error: { message: "指定されたシナリオが存在しません。" } },
        { status: 404 },
      );
    }

    // BusinessPlan を upsert
    const businessPlan = await prisma.businessPlan.upsert({
      where: {
        businessId_scenarioId_fiscalYear: {
          businessId,
          scenarioId: scenario.id,
          fiscalYear,
        },
      },
      update: {},
      create: {
        businessId,
        scenarioId: scenario.id,
        fiscalYear,
      },
    });

    const flattened: { productId: string; month: number; amount: number }[] = [];

    for (const row of rows) {
      for (const m of row.months) {
        if (m.amount !== null && !Number.isNaN(m.amount)) {
          flattened.push({
            productId: row.productId,
            month: m.month,
            amount: m.amount,
          });
        }
      }
    }

    // いったん対象 BusinessPlan の SalesPlan を全削除し、再作成するシンプルな戦略
    await prisma.salesPlan.deleteMany({
      where: { businessPlanId: businessPlan.id },
    });

    if (flattened.length > 0) {
      await prisma.salesPlan.createMany({
        data: flattened.map((p) => ({
          businessPlanId: businessPlan.id,
          productId: p.productId,
          month: p.month,
          amount: p.amount,
        })),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/business-plans/sales-plans] Error:", error);
    return NextResponse.json(
      { success: false, error: { message: "商材別売上計画の保存に失敗しました。" } },
      { status: 500 },
    );
  }
}



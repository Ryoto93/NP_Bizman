 "use client";

import { Suspense, useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type MonthKey =
  | "m1"
  | "m2"
  | "m3"
  | "m4"
  | "m5"
  | "m6"
  | "m7"
  | "m8"
  | "m9"
  | "m10"
  | "m11"
  | "m12";

type PlanRow = {
  id: string;
  productName: string;
} & {
  [key in MonthKey]: number | null;
};

// 会計年度は 10月スタートなので、表示順も 10月-翌年9月 とする
const monthLabels: { key: MonthKey; label: string }[] = [
  { key: "m10", label: "10月" },
  { key: "m11", label: "11月" },
  { key: "m12", label: "12月" },
  { key: "m1", label: "1月" },
  { key: "m2", label: "2月" },
  { key: "m3", label: "3月" },
  { key: "m4", label: "4月" },
  { key: "m5", label: "5月" },
  { key: "m6", label: "6月" },
  { key: "m7", label: "7月" },
  { key: "m8", label: "8月" },
  { key: "m9", label: "9月" },
];

type Scenario = {
  id: string;
  name: string;
  code: string;
  category: "PLAN" | "FORECAST";
  isDefault: boolean;
};

type Business = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  businessId: string | null;
};

function BusinessPlansInner() {
  const searchParams = useSearchParams();

  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | "all">("all");

  const [fiscalYear, setFiscalYear] = useState<number>(
    Number(searchParams.get("year")) || currentYear,
  );
  const [scenarioCode, setScenarioCode] = useState<string | undefined>(
    searchParams.get("scenario") || undefined,
  );

  const [rows, setRows] = useState<PlanRow[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [businessRes, productRes, scenarioRes] = await Promise.all([
          fetch("/api/businesses"),
          fetch("/api/products"),
          fetch("/api/scenarios"),
        ]);

        const businessJson = await businessRes.json();
        const productJson = await productRes.json();
        const scenarioJson = await scenarioRes.json();

        const biz: Business[] = Array.isArray(businessJson) ? businessJson : businessJson.data ?? [];
        const prods: Product[] = Array.isArray(productJson) ? productJson : productJson.data ?? [];
        const scs: Scenario[] = scenarioJson.data ?? [];

        setBusinesses(biz);
        setProducts(prods);
        setScenarios(scs);

        if (!scenarioCode) {
          const defaultScenario =
            scs.find((s) => s.isDefault) ??
            scs.find((s) => s.code === "PLAN_BETTER") ??
            scs[0];
          if (defaultScenario) {
            setScenarioCode(defaultScenario.code);
          }
        }

        const initialRows: PlanRow[] = prods.map((p) => ({
          id: p.id,
          productName: p.name,
          m1: null,
          m2: null,
          m3: null,
          m4: null,
          m5: null,
          m6: null,
          m7: null,
          m8: null,
          m9: null,
          m10: null,
          m11: null,
          m12: null,
        }));

        setRows(initialRows);
      } catch (error) {
        console.error("Failed to load initial data for business plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 事業選択に応じて表示する商材行を切り替え
  useEffect(() => {
    const filtered =
      selectedBusinessId === "all"
        ? products
        : products.filter((p) => p.businessId === selectedBusinessId);

    const nextRows: PlanRow[] = filtered.map((p) => ({
      id: p.id,
      productName: p.name,
      m1: null,
      m2: null,
      m3: null,
      m4: null,
      m5: null,
      m6: null,
      m7: null,
      m8: null,
      m9: null,
      m10: null,
      m11: null,
      m12: null,
    }));

    setRows(nextRows);
  }, [products, selectedBusinessId]);

  const columns = useMemo<ColumnDef<PlanRow>[]>(
    () => [
      {
        header: "商材",
        accessorKey: "productName",
        cell: ({ row }) => row.original.productName,
      },
      ...monthLabels.map((m) => ({
        header: m.label,
        accessorKey: m.key,
        cell: ({ row, column, table }: any) => {
          const value = row.original[m.key] ?? "";
          return (
            <Input
              type="number"
              className="h-8 w-24"
              value={value}
              onChange={(e) => {
                const next = [...table.options.data] as PlanRow[];
                const target = next.find((r) => r.id === row.original.id);
                if (target) {
                  const num = e.target.value === "" ? null : Number(e.target.value);
                  (target as any)[m.key] = isNaN(num as any) ? null : num;
                  setRows(next);
                }
              }}
            />
          );
        },
      })),
      {
        header: "合計",
        id: "total",
        cell: ({ row }) => {
          const total = monthLabels.reduce((sum, m) => {
            const v = row.original[m.key];
            return sum + (v ?? 0);
          }, 0);
          return <span className="font-medium">{total.toLocaleString()}</span>;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSave = async () => {
    if (!scenarioCode || !selectedBusinessId || rows.length === 0) return;

    try {
      setSaving(true);

      const payload = {
        businessId: selectedBusinessId === "all" ? null : selectedBusinessId,
        scenarioCode,
        fiscalYear,
        rows: rows.map((r) => ({
          productId: r.id,
          months: [
            { month: 1, amount: r.m1 },
            { month: 2, amount: r.m2 },
            { month: 3, amount: r.m3 },
            { month: 4, amount: r.m4 },
            { month: 5, amount: r.m5 },
            { month: 6, amount: r.m6 },
            { month: 7, amount: r.m7 },
            { month: 8, amount: r.m8 },
            { month: 9, amount: r.m9 },
            { month: 10, amount: r.m10 },
            { month: 11, amount: r.m11 },
            { month: 12, amount: r.m12 },
          ],
        })),
      };

      const res = await fetch("/api/business-plans/sales-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to save sales plans", await res.text());
        alert("保存に失敗しました。時間をおいて再度お試しください。");
        return;
      }

      alert("売上計画を保存しました。");
    } catch (error) {
      console.error("Error saving sales plans:", error);
      alert("保存中にエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">事業計画（売上計画）</h1>
        <p className="text-sm text-muted-foreground mt-1">
          シナリオ（Bad / Better / Best / 最新見込み）ごとに、商材別の月次売上計画を入力します。
        </p>
      </div>

      {loading && (
        <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          事業・商材・シナリオ情報を読み込み中です…
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>条件</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <Label htmlFor="fiscalYear">会計年度</Label>
            <Input
              id="fiscalYear"
              type="number"
              className="w-32"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(Number(e.target.value) || currentYear)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="business">事業</Label>
            <Select
              value={selectedBusinessId}
              onValueChange={(value) => setSelectedBusinessId(value as string | "all")}
            >
              <SelectTrigger id="business" className="w-56">
                <SelectValue placeholder="事業を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての事業</SelectItem>
                {businesses.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="scenario">シナリオ</Label>
            <Select value={scenarioCode} onValueChange={(value) => setScenarioCode(value)}>
              <SelectTrigger id="scenario" className="w-56">
                <SelectValue placeholder="シナリオを選択" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((s) => {
                  const suffix = s.category === "FORECAST" ? "（最新見込み）" : "（予算）";
                  return (
                    <SelectItem key={s.code} value={s.code}>
                      {s.name}
                      {suffix}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>商材別 売上計画（円）</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setRows(rows)}>
              一括入力・成長率適用（今後実装）
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || !scenarioCode}>
              {saving ? "保存中..." : "保存"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="min-w-max border-collapse text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`border-b px-3 py-2 text-left font-semibold whitespace-nowrap ${
                          header.column.id === "productName"
                            ? "sticky left-0 z-10 bg-background"
                            : "bg-muted"
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/40">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border-b px-2 py-1 align-middle">
                        <div
                          className={
                            cell.column.id === "productName"
                              ? "min-w-[200px] pr-4 font-medium sticky left-0 bg-background"
                              : "min-w-[80px]"
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BusinessPlansPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">読み込み中...</div>}>
      <BusinessPlansInner />
    </Suspense>
  );
}



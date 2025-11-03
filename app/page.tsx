import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          ダッシュボード
        </h1>
        <p className="text-muted-foreground">
          全社の「今」の状況をスナップショットで把握
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>全社YTDサマリー</CardTitle>
            <CardDescription>会計年度累計の予実比較</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              データ準備中...
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CRMサマリー</CardTitle>
            <CardDescription>顧客・案件の状況</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              データ準備中...
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>グラフ表示</CardTitle>
            <CardDescription>売上・コストの推移</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              データ準備中...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


# API設計書

## API設計方針

- Next.js App RouterのAPI Routesを使用
- RESTful API設計を基本とする
- 認証はSupabase Authを使用
- レスポンス形式はJSON統一

## 認証・認可

すべてのAPIエンドポイントは認証が必要（Supabase Authを使用）

```typescript
// middleware.ts で認証チェック
export async function middleware(request: NextRequest) {
  // Supabase Auth でトークン検証
}
```

## APIエンドポイント一覧

### 1. マスター管理API

#### 事業マスター
```
GET    /api/businesses              // 事業一覧取得
GET    /api/businesses/:id          // 事業詳細取得
POST   /api/businesses              // 事業作成
PATCH  /api/businesses/:id          // 事業更新
DELETE /api/businesses/:id          // 事業削除
```

#### 商材マスター
```
GET    /api/products                // 商材一覧取得
GET    /api/products/:id            // 商材詳細取得
POST   /api/products                // 商材作成
PATCH  /api/products/:id            // 商材更新
DELETE /api/products/:id            // 商材削除
```

#### 案件ステータス
```
GET    /api/deal-statuses           // ステータス一覧取得
GET    /api/deal-statuses/:id       // ステータス詳細取得
POST   /api/deal-statuses            // ステータス作成
PATCH  /api/deal-statuses/:id       // ステータス更新
DELETE /api/deal-statuses/:id       // ステータス削除
```

### 2. 事業計画API

#### KPI管理
```
GET    /api/businesses/:businessId/kpis              // KPI一覧取得
POST   /api/businesses/:businessId/kpis              // KPI作成
PATCH  /api/kpis/:id                                  // KPI更新
DELETE /api/kpis/:id                                  // KPI削除
```

#### 売上ロジック
```
GET    /api/businesses/:businessId/revenue-logic     // 売上ロジック取得
POST   /api/businesses/:businessId/revenue-logic     // 売上ロジック作成/更新
```

#### KPI計画
```
GET    /api/business-plans/:planId/kpi-plans         // KPI計画一覧取得（月次）
POST   /api/business-plans/:planId/kpi-plans/batch   // KPI計画一括登録/更新
```

#### KPI実績
```
GET    /api/kpi-results                               // KPI実績一覧取得（年月指定）
POST   /api/kpi-results/batch                         // KPI実績一括登録/更新
```

#### 売上実績
```
GET    /api/business-plans/:planId/revenue-results    // 売上実績一覧取得（月次）
POST   /api/business-plans/:planId/revenue-results    // 売上実績登録/更新
```

#### 事業コスト項目
```
GET    /api/businesses/:businessId/cost-items        // コスト項目一覧取得
POST   /api/businesses/:businessId/cost-items        // コスト項目作成
PATCH  /api/cost-items/:id                            // コスト項目更新
DELETE /api/cost-items/:id                            // コスト項目削除
```

#### 事業コスト計画
```
GET    /api/business-plans/:planId/cost-plans         // コスト計画一覧取得（月次）
POST   /api/business-plans/:planId/cost-plans/batch   // コスト計画一括登録/更新
```

#### 事業コスト実績
```
GET    /api/business-plans/:planId/cost-results       // コスト実績一覧取得（月次）
POST   /api/business-plans/:planId/cost-results/batch // コスト実績一括登録/更新
```

#### 事業計画サマリー
```
GET    /api/business-plans/:planId/summary            // 事業計画サマリー取得
```

### 3. コーポレート計画API

#### 人員管理
```
GET    /api/persons                                   // 人員一覧取得（シナリオ指定）
POST   /api/persons                                   // 人員作成
PATCH  /api/persons/:id                               // 人員更新
DELETE /api/persons/:id                               // 人員削除
```

#### 全社コスト項目
```
GET    /api/corporate-cost-items                      // コスト項目一覧取得
POST   /api/corporate-cost-items                      // コスト項目作成
PATCH  /api/corporate-cost-items/:id                  // コスト項目更新
DELETE /api/corporate-cost-items/:id                  // コスト項目削除
```

#### 全社コスト計画
```
GET    /api/corporate-cost-plans                      // コスト計画一覧取得（年月・シナリオ指定）
POST   /api/corporate-cost-plans/batch                // コスト計画一括登録/更新
GET    /api/corporate-cost-plans/auto-calculate       // 自動計算項目の計算結果取得
```

#### 全社コスト実績
```
GET    /api/corporate-cost-results                    // コスト実績一覧取得（年月指定）
POST   /api/corporate-cost-results/batch              // コスト実績一括登録/更新
```

### 4. CRM API

#### 顧客管理
```
GET    /api/customers                                 // 顧客一覧取得
GET    /api/customers/:id                             // 顧客詳細取得
POST   /api/customers                                 // 顧客作成
PATCH  /api/customers/:id                             // 顧客更新
DELETE /api/customers/:id                             // 顧客削除
```

#### 案件管理
```
GET    /api/deals                                     // 案件一覧取得（フィルタ対応）
GET    /api/deals/:id                                 // 案件詳細取得
POST   /api/deals                                     // 案件作成
PATCH  /api/deals/:id                                 // 案件更新
DELETE /api/deals/:id                                 // 案件削除
PATCH  /api/deals/:id/status                          // 案件ステータス更新（受注時に自動連携）
```

#### CRMサマリー
```
GET    /api/crm/summary                               // CRMサマリー取得
```

### 5. ダッシュボードAPI

#### 全社サマリー
```
GET    /api/dashboard/ytd-summary                     // YTDサマリー取得（年指定）
GET    /api/dashboard/crm-summary                     // CRMサマリー取得
```

## リクエスト/レスポンス形式

### 標準レスポンス形式

#### 成功時
```json
{
  "success": true,
  "data": { ... }
}
```

#### エラー時
```json
{
  "success": false,
  "error": {
    "message": "エラーメッセージ",
    "code": "ERROR_CODE"
  }
}
```

### 主要APIの詳細

#### POST /api/business-plans/:planId/kpi-plans/batch
**リクエスト**
```json
{
  "kpiPlans": [
    {
      "kpiId": "uuid",
      "month": 1,
      "value": 100,
      "notes": "メモ"
    }
  ]
}
```

#### POST /api/deals/:id/status
**リクエスト**
```json
{
  "statusId": "uuid",
  "notes": "メモ"
}
```
**処理内容**: ステータスが「受注」の場合、自動的に売上実績に連携

#### GET /api/corporate-cost-plans/auto-calculate
**クエリパラメータ**
- scenarioId: string
- month: number (1-12)
- year: number

**レスポンス**
```json
{
  "success": true,
  "data": {
    "personnelCost": 1000000,    // 人件費
    "welfareCost": 150000,       // 法定福利費
    "outsourcingCost": 500000    // 業務委託費
  }
}
```

## バリデーション

### 入力バリデーション
- 月: 1-12の範囲
- 金額: 0以上の数値
- 必須項目のチェック
- UUID形式の検証

### ビジネスロジックバリデーション
- 同一月・年・事業・シナリオの重複チェック
- 案件ステータス更新時の自動連携チェック
- 売上ロジックの計算式検証

## エラーハンドリング

### エラーコード一覧
- `VALIDATION_ERROR`: バリデーションエラー
- `NOT_FOUND`: リソースが見つからない
- `UNAUTHORIZED`: 認証エラー
- `FORBIDDEN`: 権限エラー
- `INTERNAL_ERROR`: サーバー内部エラー

## パフォーマンス最適化

### バッチ処理
- 一括登録/更新APIを提供（TanStack Tableの一括入力に対応）

### キャッシュ戦略
- マスターデータは適切にキャッシュ
- Next.jsのキャッシュ機能を活用

### N+1問題の回避
- Prismaのincludeを適切に使用
- 必要なデータを一度のクエリで取得



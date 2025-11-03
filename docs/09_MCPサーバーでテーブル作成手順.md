# MCPサーバーでSupabaseテーブル作成手順

## 概要

MCPサーバーを使用して、Prismaスキーマに基づいてSupabaseにテーブル構造を作成します。

## 前提条件

- Supabaseプロジェクトが作成済み
- MCPサーバーが設定済み（`.cursor/mcp.json`）
- Prismaスキーマが完成済み（`prisma/schema.prisma`）

## 手順

### 1. Prismaスキーマの確認

`prisma/schema.prisma` が正しく設定されていることを確認してください。

### 2. MCPサーバーを使用したテーブル作成

MCPサーバーに以下の情報を提供してテーブルを作成します：

#### 必要な情報
- **Prismaスキーマファイル**: `prisma/schema.prisma`
- **Supabaseプロジェクト参照**: `.cursor/mcp.json`に設定済み

#### MCPサーバーへの指示例

```
Supabaseプロジェクト（project_ref: fgnbfczmvsauzmzjuhpl）に、
prisma/schema.prismaファイルに基づいてテーブル構造を作成してください。

以下のテーブルを作成：
- Scenario（シナリオ）
- Business（事業）
- Product（商材）
- DealStatus（案件ステータス）
- Customer（顧客）
- Deal（案件）
- KPI（KPI定義）
- RevenueLogic（売上ロジック）
- RevenueLogicEntry（売上ロジックエントリ）
- BusinessPlan（事業計画）
- KPIPlan（KPI計画）
- KPIResult（KPI実績）
- RevenueResult（売上実績）
- BusinessCostItem（事業コスト項目）
- BusinessCostPlan（事業コスト計画）
- BusinessCostResult（事業コスト実績）
- Person（人員）
- CorporateCostItem（全社コスト項目）
- CorporateCostPlan（全社コスト計画）
- CorporateCostResult（全社コスト実績）
- UserProfile（ユーザープロフィール）

各テーブルには、Prismaスキーマで定義された：
- カラムとデータ型
- 主キー
- 外部キー制約
- インデックス
- 一意制約
を含めてください。
```

### 3. テーブル作成後の確認

Supabaseダッシュボードで以下を確認：
1. Table Editor でテーブルが作成されていること
2. 各テーブルのカラムが正しく設定されていること
3. リレーションシップ（外部キー）が正しく設定されていること

### 4. 初期データの投入

テーブル作成後、初期データを投入：

```bash
npm run prisma:seed
```

または：

```bash
npx tsx prisma/seed.ts
```

## トラブルシューティング

### データベース接続エラーが発生する場合

Prisma Migrateを使用する場合は、`DATABASE_URL`の確認が必要です。

**確認事項：**
1. `.env.local`に`DATABASE_URL`が正しく設定されているか
2. 接続文字列の形式が正しいか：
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   ```
3. Supabaseプロジェクトがアクティブか
4. 接続プーリングを使用する場合は、Connection pooling用の接続文字列を使用

**接続プーリング用の接続文字列：**
Supabaseダッシュボード > Settings > Database > Connection string > Connection pooling から取得

## 参考

- [Supabase MCP Server](https://supabase.com/docs/guides/mcp)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)


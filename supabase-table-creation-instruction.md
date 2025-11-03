# Supabaseテーブル作成指示（MCPサーバー用）

Supabaseプロジェクト（project_ref: fgnbfczmvsauzmzjuhpl）に、以下のPrismaスキーマに基づいてテーブル構造を作成してください。

## プロジェクト情報
- Project Reference: fgnbfczmvsauzmzjuhpl
- Prisma Schema File: prisma/schema.prisma

## 作成するテーブル一覧

1. **Scenario** - シナリオマスター
2. **Business** - 事業マスター
3. **Product** - 商材マスター
4. **DealStatus** - 案件ステータスマスター
5. **Customer** - 顧客マスター
6. **Deal** - 案件情報
7. **KPI** - KPI定義
8. **RevenueLogic** - 売上ロジック
9. **RevenueLogicEntry** - 売上ロジックエントリ
10. **BusinessPlan** - 事業計画
11. **KPIPlan** - KPI計画
12. **KPIResult** - KPI実績
13. **RevenueResult** - 売上実績
14. **BusinessCostItem** - 事業コスト項目
15. **BusinessCostPlan** - 事業コスト計画
16. **BusinessCostResult** - 事業コスト実績
17. **Person** - 人員情報
18. **CorporateCostItem** - 全社コスト項目
19. **CorporateCostPlan** - 全社コスト計画
20. **CorporateCostResult** - 全社コスト実績
21. **UserProfile** - ユーザープロフィール

## 重要な要件

- Prismaスキーマファイル（`prisma/schema.prisma`）の定義に従って作成
- 各テーブルには主キー、外部キー、インデックス、一意制約を含める
- UUIDを主キーとして使用
- 適切なデータ型を設定（Decimal型は`NUMERIC`または`DECIMAL`として）
- リレーションシップ（外部キー制約）を正しく設定

## 初期データ（後で投入）

テーブル作成後、以下の初期データを投入する予定：
- シナリオ: Betterケース、Badケース
- 案件ステータス: リード、商談中、受注、失注
- 全社コスト項目（自動計算）: 人件費、法定福利費、業務委託費


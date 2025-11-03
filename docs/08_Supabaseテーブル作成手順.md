# Supabaseテーブル作成手順

## 概要

このドキュメントでは、Prismaスキーマに基づいてSupabaseにテーブル構造を作成する方法を説明します。

## 方法1: Prisma Migrateを使用（推奨）

### 手順

1. **環境変数の確認**
   `.env.local` に `DATABASE_URL` が正しく設定されているか確認してください。

2. **マイグレーションファイルの作成**
   ```bash
   npx prisma migrate dev --name init
   ```
   
   これにより、`prisma/migrations` ディレクトリにマイグレーションファイルが作成され、Supabaseデータベースにテーブルが作成されます。

3. **Prisma Clientの生成**
   ```bash
   npx prisma generate
   ```

4. **初期データの投入**
   ```bash
   npm run prisma:seed
   ```

### トラブルシューティング

#### データベース接続エラーが発生する場合

- Supabaseプロジェクトがアクティブか確認
- `DATABASE_URL` が正しく設定されているか確認
- 接続文字列のパスワードが正しく置き換えられているか確認
- Supabaseダッシュボードでデータベースが起動しているか確認

## 方法2: MCPサーバーを使用

MCPサーバーを使ってSupabaseに直接テーブルを作成することも可能です。

### 手順

1. MCPサーバーにPrismaスキーマファイル（`prisma/schema.prisma`）を提供
2. MCPサーバーでテーブル作成を実行

詳細は、MCPサーバーのドキュメントを参照してください。

## 方法3: Supabase DashboardからSQLを実行

SupabaseダッシュボードのSQL Editorから、Prisma Migrateで生成されたSQLを直接実行することも可能です。

### 手順

1. Prisma Migrateでマイグレーションファイルを生成
2. `prisma/migrations/YYYYMMDDHHMMSS_init/migration.sql` を開く
3. Supabaseダッシュボード > SQL Editor に移動
4. SQLファイルの内容をコピーして実行

## 初期データの投入

テーブル作成後、初期データを投入します：

```bash
npm run prisma:seed
```

または、直接実行：

```bash
npx tsx prisma/seed.ts
```

投入されるデータ：
- **シナリオ**: Betterケース、Badケース
- **案件ステータス**: リード、商談中、受注、失注
- **全社コスト項目（自動計算）**: 人件費、法定福利費、業務委託費

## 次のステップ

テーブル作成と初期データ投入が完了したら：

1. **Row Level Security (RLS) ポリシーの設定**
   - Supabaseダッシュボードで各テーブルにRLSポリシーを設定
   - 認証済みユーザーのみアクセス可能にする

2. **アプリケーション開発の開始**
   - API Routesの実装
   - 画面コンポーネントの実装

## 参考リンク

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Supabase Database](https://supabase.com/docs/guides/database)


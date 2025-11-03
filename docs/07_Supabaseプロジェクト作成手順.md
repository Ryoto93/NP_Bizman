# Supabaseプロジェクト作成手順

## 概要

このドキュメントでは、NP Business Managementプロジェクト用のSupabaseプロジェクトを作成する手順を説明します。

## 手順

### 1. Supabaseアカウントの作成

1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインイン（推奨）またはメールアドレスでサインアップ

### 2. プロジェクトの作成

1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - **Organization**: 既存の組織を選択、または新規作成
   - **Name**: `np-business-management`（任意の名前）
   - **Database Password**: 強力なパスワードを設定（**安全に保管**）
   - **Region**: `ap-northeast-1`（東京）を選択
   - **Pricing Plan**: Free tier を選択
3. 「Create new project」をクリック
4. プロジェクトの作成完了まで数分待機

### 3. 接続情報の取得

#### 3-1. API URL と Anon Key の取得

1. プロジェクトダッシュボードで「Settings」（左側メニュー下部の歯車アイコン）をクリック
2. 「API」を選択
3. 以下の情報をコピー：
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL` に設定
   - **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` に設定（**機密情報**）

#### 3-2. データベース接続文字列の取得

1. 「Settings」> 「Database」を選択
2. 「Connection string」セクションに移動
3. **Connection pooling** のタブを選択
4. **URI** を選択して接続文字列をコピー
5. `DATABASE_URL` に設定（パスワード部分 `[YOUR-PASSWORD]` を実際のパスワードに置き換える）

例：
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### 4. 環境変数の設定

1. プロジェクトルートに `.env.local` ファイルを作成
2. `.env.local.template` の内容をコピー
3. 取得した接続情報を設定：

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**重要**: 
- `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません
- `SUPABASE_SERVICE_ROLE_KEY` は絶対に公開しないでください

### 5. 接続テスト（オプション）

環境変数を設定後、開発サーバーを再起動して接続を確認：

```bash
npm run dev
```

エラーが出ないことを確認してください。

## 次のステップ

Supabaseプロジェクトの作成と環境変数の設定が完了したら：

1. **MCPサーバーでSupabase設計を実行**
   - `docs/05_Supabase設計準備ガイド.md` を参照
   - MCPサーバーに以下の情報を提供：
     - Supabase URL
     - API Keys
     - データベース設計書（`docs/02_データベース設計.md`）

2. **Prismaスキーマの実装**
   - `prisma/schema.prisma` を完成させる
   - データベース設計書に基づいてスキーマを実装

3. **マイグレーション実行**
   - Prisma Migrateでデータベースにスキーマを適用

## トラブルシューティング

### 開発サーバー起動エラー

#### "Unable to acquire lock" エラーが発生する場合

別のNext.js開発サーバーのインスタンスが実行中の場合に発生します。以下の方法で解消できます：

**方法1: ロックファイルを削除**
```powershell
# PowerShell
if (Test-Path ".next\dev\lock") { Remove-Item ".next\dev\lock" -Force }
```

**方法2: 実行中のプロセスを停止**
```powershell
# PowerShell - ポート3000を使用しているプロセスを確認
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object OwningProcess
# プロセスIDが表示されたら、そのプロセスを停止
Stop-Process -Id [プロセスID] -Force
```

**方法3: .nextディレクトリを完全削除（最終手段）**
```powershell
# PowerShell
Remove-Item -Recurse -Force .next
```

その後、再度 `npm run dev` を実行してください。

#### ポートが使用中の場合

エラーメッセージで「Port 3000 is in use」と表示される場合、自動的に別のポート（例: 3001）が使用されます。問題ありません。

### 接続エラーが発生する場合

- 環境変数が正しく設定されているか確認
- Supabaseプロジェクトがアクティブか確認（削除されていないか）
- データベースパスワードが正しいか確認
- 接続文字列のパスワード部分が正しく置き換えられているか確認

### Service Role Key が見つからない場合

- Settings > API > service_role を確認
- 必要に応じて「Reveal」ボタンをクリックして表示

## 参考リンク

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Supabase Getting Started](https://supabase.com/docs/guides/getting-started)
- [Supabase Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)



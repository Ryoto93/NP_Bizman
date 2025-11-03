# NP Business Management

スタートアップ立ち上げ一年間の「収支計画」「予実管理」「人員・コスト管理」「顧客管理(CRM)」を一つのツールで完結させるWebアプリケーション

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Shadcn/ui
- **データベース**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **認証**: Supabase Auth
- **テーブルUI**: TanStack Table
- **フォーム**: React Hook Form
- **グラフ**: Recharts

## 開発環境セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

Supabaseプロジェクトを作成し、接続情報を取得してください。

詳細な手順は [`docs/07_Supabaseプロジェクト作成手順.md`](./docs/07_Supabaseプロジェクト作成手順.md) を参照してください。

### 3. 環境変数の設定

`env.template`をコピーして`.env.local`を作成し、Supabaseプロジェクトの接続情報を設定してください。

```bash
cp env.template .env.local
```

その後、`.env.local`を開いて、Supabaseプロジェクトから取得した接続情報を設定してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
.
├── app/                  # Next.js App Router
│   ├── layout.tsx       # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル
├── components/           # Reactコンポーネント
│   ├── ui/              # Shadcn/uiコンポーネント
│   └── layout/          # レイアウトコンポーネント
├── lib/                 # ユーティリティ関数
│   └── supabase/       # Supabaseクライアント設定
├── prisma/              # Prismaスキーマ
├── docs/                # ドキュメント
└── middleware.ts        # Next.js middleware（認証用）

```

## 開発フェーズ

詳細は `docs/01_プロジェクト概要と開発計画.md` を参照してください。

### Phase 1: プロジェクトセットアップと基盤構築 ✅
- [x] Next.jsプロジェクトの初期化
- [x] Shadcn/uiのセットアップ
- [x] UIデザイン（オレンジテーマ）の適用
- [x] 基本的なレイアウトとナビゲーション構築
- [x] Supabaseプロジェクトのセットアップ
- [x] Prismaスキーマの設計と実装
- [x] データベーステーブルの作成
- [x] 認証機能の実装

## UIデザイン

メインカラー: **オレンジ** (`#F95F06`)

デザインコンセプト: **シンプル、モダン、エピック**

詳細は `docs/06_UIデザインガイドライン.md` を参照してください。

## ドキュメント

- [プロジェクト概要と開発計画](./docs/01_プロジェクト概要と開発計画.md)
- [データベース設計書](./docs/02_データベース設計.md)
- [API設計書](./docs/03_API設計.md)
- [画面設計書](./docs/04_画面設計.md)
- [UIデザインガイドライン](./docs/06_UIデザインガイドライン.md)
- [Supabaseプロジェクト作成手順](./docs/07_Supabaseプロジェクト作成手順.md)
- [Supabaseテーブル作成手順](./docs/08_Supabaseテーブル作成手順.md)
- [認証機能動作確認手順](./docs/13_認証機能動作確認手順.md)

## 認証機能の動作確認

認証機能を実装しました。動作確認手順は [`docs/13_認証機能動作確認手順.md`](./docs/13_認証機能動作確認手順.md) を参照してください。

簡単な確認手順：

1. Supabaseダッシュボードでテストユーザーを作成
2. ブラウザで `http://localhost:3000` にアクセス
3. ログイン画面で認証情報を入力してログイン
4. ダッシュボードにリダイレクトされることを確認

## ライセンス

ISC


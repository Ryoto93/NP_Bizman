# DATABASE_URL修正手順

## 現在の状況

データベース接続エラーが発生しています。接続文字列は設定されていますが、ホストに接続できません。

## 確認事項

### 1. Supabaseプロジェクトの状態確認

1. Supabaseダッシュボードにアクセス
2. プロジェクトが起動していることを確認
3. プロジェクト参照ID（project_ref）を確認

### 2. 正しい接続文字列の取得

#### 方法A: Supabaseダッシュボードから直接取得（推奨）

1. Supabaseダッシュボード > Settings > Database
2. Connection string セクション
3. **Connection pooling** タブを選択（推奨）
4. **URI** を選択してコピー
5. `.env`ファイルの`DATABASE_URL`に貼り付け

**接続プーリング用の形式（推奨）:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

**直接接続用の形式:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

#### 方法B: 手動で構築

1. Project Referenceを確認（SupabaseダッシュボードのURLから）
2. データベースパスワードを確認（プロジェクト作成時に設定）
3. 以下の形式で構築：

```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### 3. パスワードの特殊文字について

パスワードに特殊文字（`!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(` `)`, `+`, `=`, `?`, `{`, `}`, `[`, `]`, `|`, `\`, `/`, `<`, `>`, `.`, `,`, `;`, `:`など）が含まれる場合は、URLエンコードが必要です。

例：
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

### 4. 接続テスト

接続文字列を更新後：

```bash
npx tsx scripts/test-db-connection.ts
```

### 5. 接続プーリングの使用を推奨

Supabaseでは接続プーリングの使用を推奨しています：

**接続プーリング用の接続文字列:**
- ホスト: `aws-0-ap-northeast-1.pooler.supabase.com`
- ポート: `6543`
- ユーザー名: `postgres.[PROJECT_REF]`

**メリット:**
- 接続数の制限を効率的に管理
- より安定した接続
- パフォーマンス向上

## トラブルシューティング

### エラー: "Can't reach database server"

**原因:**
1. プロジェクトが起動していない
2. ホスト名が間違っている
3. ネットワーク接続の問題
4. ファイアウォールの設定

**対処:**
1. Supabaseダッシュボードでプロジェクトの状態を確認
2. 接続文字列のホスト名が正しいか確認（project_refが正しいか）
3. 接続プーリング用の接続文字列を試す

### エラー: "password authentication failed"

**原因:**
1. パスワードが間違っている
2. パスワードの特殊文字がURLエンコードされていない

**対処:**
1. パスワードを確認
2. 特殊文字をURLエンコード
3. Supabaseダッシュボードから接続文字列を再取得

## 参考

- [Supabase Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)


import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

const envLocalPath = resolve(process.cwd(), ".env.local");
const envPath = resolve(process.cwd(), ".env");

console.log("=== 環境変数ファイルの確認 ===");
console.log(".env.local:", existsSync(envLocalPath) ? "✅ 存在" : "❌ 存在しない");
console.log(".env:", existsSync(envPath) ? "✅ 存在" : "❌ 存在しない");

// .env.localを優先的に読み込む
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
  console.log("\n.env.local を読み込みました");
} else if (existsSync(envPath)) {
  config({ path: envPath });
  console.log("\n.env を読み込みました");
} else {
  console.log("\n⚠️  環境変数ファイルが見つかりません");
}

// 環境変数を確認
const dbUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("\n=== 環境変数の内容 ===");
console.log("DATABASE_URL:", dbUrl ? `${dbUrl.substring(0, 50)}...` : "❌ 未設定");
console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl || "❌ 未設定");
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : "❌ 未設定");

if (dbUrl) {
  // 接続文字列の形式チェック
  const isValidFormat = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");
  console.log("\n=== 接続文字列の検証 ===");
  console.log("形式:", isValidFormat ? "✅ 正しい" : "❌ 不正");
  
  // ホスト名とポートを抽出
  const hostMatch = dbUrl.match(/@([^:/]+)(?::(\d+))?/);
  if (hostMatch) {
    console.log("ホスト:", hostMatch[1]);
    console.log("ポート:", hostMatch[2] || "5432 (デフォルト)");
  }
  
  // プレースホルダーのチェック
  if (dbUrl.includes("[YOUR-PASSWORD]") || dbUrl.includes("[PASSWORD]")) {
    console.log("⚠️  パスワードがプレースホルダーのままです！");
  }
}


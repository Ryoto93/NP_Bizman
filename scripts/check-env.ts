import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

// .env.localを読み込む
config({ path: resolve(__dirname, "../.env.local") });

const dbUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

console.log("=== 環境変数の確認 ===");
console.log("DATABASE_URL:", dbUrl ? `${dbUrl.substring(0, 30)}...（長さ: ${dbUrl.length}）` : "❌ 設定されていません");
console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl || "❌ 設定されていません");

if (dbUrl) {
  // 接続文字列の形式を確認
  const isValidFormat = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");
  console.log("\nDATABASE_URL形式チェック:", isValidFormat ? "✅ 正しい形式" : "❌ 形式が正しくありません");
  
  // パスワードが設定されているか確認（[YOUR-PASSWORD]などのプレースホルダーがないか）
  const hasPlaceholder = dbUrl.includes("[YOUR-PASSWORD]") || dbUrl.includes("[PASSWORD]");
  if (hasPlaceholder) {
    console.log("⚠️  パスワードがプレースホルダーのままです！");
  }
  
  // ホスト名を抽出
  const hostMatch = dbUrl.match(/@([^:]+):(\d+)/);
  if (hostMatch) {
    console.log("接続先ホスト:", hostMatch[1]);
    console.log("ポート:", hostMatch[2]);
  }
}


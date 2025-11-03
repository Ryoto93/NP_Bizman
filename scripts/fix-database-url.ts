import { config } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// .envファイルを読み込む
config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URLが設定されていません");
  process.exit(1);
}

console.log("元の接続文字列:", dbUrl);

// URLをパース
try {
  const url = new URL(dbUrl);
  const password = url.password;
  
  // パスワードがURLエンコードされているか確認
  const decodedPassword = decodeURIComponent(password);
  
  // 特殊文字が含まれている場合はエンコードが必要
  if (password !== encodeURIComponent(decodedPassword)) {
    console.log("\nパスワードに特殊文字が検出されました");
    console.log("元のパスワード:", password);
    
    // パスワードをURLエンコード
    const encodedPassword = encodeURIComponent(decodedPassword);
    const newUrl = dbUrl.replace(`:${password}@`, `:${encodedPassword}@`);
    
    console.log("\n修正後の接続文字列:", newUrl.substring(0, 50) + "...");
    console.log("\n⚠️  この接続文字列を.envファイルに設定してください");
  } else {
    console.log("✅ 接続文字列は正しくエンコードされています");
  }
} catch (error) {
  console.error("❌ URLの解析に失敗しました:", error);
}


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔌 データベース接続をテストしています...");
    await prisma.$connect();
    console.log("✅ データベース接続成功！");
    
    // 簡単なクエリで接続を確認
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ クエリ実行成功:", result);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ データベース接続エラー:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();


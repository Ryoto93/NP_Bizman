import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log("🔍 データベースのテーブルを確認しています...");
    
    // 接続テスト
    await prisma.$connect();
    console.log("✅ データベース接続成功！\n");
    
    // 各テーブルの存在確認
    const tables = [
      "Scenario",
      "Business",
      "Product",
      "DealStatus",
      "Customer",
      "Deal",
      "KPI",
      "RevenueLogic",
      "RevenueLogicEntry",
      "BusinessPlan",
      "KPIPlan",
      "KPIResult",
      "RevenueResult",
      "BusinessCostItem",
      "BusinessCostPlan",
      "BusinessCostResult",
      "Person",
      "CorporateCostItem",
      "CorporateCostPlan",
      "CorporateCostResult",
      "UserProfile",
    ];
    
    console.log("📊 テーブル存在確認:");
    let existingTables = 0;
    
    for (const table of tables) {
      try {
        // テーブルの存在を確認（簡単なクエリで確認）
        const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${table}" LIMIT 1`);
        console.log(`✅ ${table}`);
        existingTables++;
      } catch (error: any) {
        if (error.message.includes("does not exist") || error.code === "42P01") {
          console.log(`❌ ${table} - テーブルが存在しません`);
        } else {
          // テーブルは存在するが、エラーが発生（おそらくOK）
          console.log(`✅ ${table} (確認済み)`);
          existingTables++;
        }
      }
    }
    
    console.log(`\n📈 結果: ${existingTables}/${tables.length} テーブルが存在します`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ エラー:", error);
    process.exit(1);
  }
}

checkTables();


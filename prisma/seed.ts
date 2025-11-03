import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 初期データの投入を開始します...");

  // 1. シナリオマスター
  console.log("📊 シナリオマスターを作成中...");
  const betterScenario = await prisma.scenario.upsert({
    where: { id: "better-case" },
    update: {},
    create: {
      id: "better-case",
      name: "Betterケース",
    },
  });
  console.log(`✅ ${betterScenario.name} を作成`);

  const badScenario = await prisma.scenario.upsert({
    where: { id: "bad-case" },
    update: {},
    create: {
      id: "bad-case",
      name: "Badケース",
    },
  });
  console.log(`✅ ${badScenario.name} を作成`);

  // 2. 案件ステータス
  console.log("📋 案件ステータスを作成中...");
  const statuses = [
    { id: "lead", name: "リード", order: 1 },
    { id: "negotiation", name: "商談中", order: 2 },
    { id: "won", name: "受注", order: 3 },
    { id: "lost", name: "失注", order: 4 },
  ];

  for (const status of statuses) {
    await prisma.dealStatus.upsert({
      where: { id: status.id },
      update: { name: status.name, order: status.order },
      create: status,
    });
    console.log(`✅ ${status.name} を作成`);
  }

  // 3. 全社コスト項目（自動計算項目）
  console.log("💰 全社コスト項目（自動計算）を作成中...");
  const autoCostItems = [
    { id: "personnel", name: "人件費", isAuto: true },
    { id: "welfare", name: "法定福利費", isAuto: true },
    { id: "outsourcing", name: "業務委託費", isAuto: true },
  ];

  for (const item of autoCostItems) {
    await prisma.corporateCostItem.upsert({
      where: { id: item.id },
      update: { name: item.name, isAuto: item.isAuto },
      create: item,
    });
    console.log(`✅ ${item.name} を作成`);
  }

  console.log("🎉 初期データの投入が完了しました！");
}

main()
  .catch((e) => {
    console.error("❌ エラーが発生しました:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


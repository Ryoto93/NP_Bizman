-- NP Business Management データベーススキーマ
-- このSQLはSupabaseダッシュボードのSQL Editorで実行するか、MCPサーバーで実行してください

-- ============================================
-- 拡張機能の有効化
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- マスターデータ
-- ============================================

-- シナリオテーブル
CREATE TABLE IF NOT EXISTS "Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 事業テーブル
CREATE TABLE IF NOT EXISTS "Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 商材テーブル
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "businessId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 案件ステータステーブル
CREATE TABLE IF NOT EXISTS "DealStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 顧客テーブル
CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- 案件・CRM
-- ============================================

-- 案件テーブル
CREATE TABLE IF NOT EXISTS "Deal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT,
    "statusId" TEXT NOT NULL,
    "expectedMonth" INTEGER NOT NULL,
    "expectedYear" INTEGER NOT NULL,
    "expectedAmount" DECIMAL(15,2) NOT NULL,
    "assignedUserId" TEXT,
    "activityHistory" JSONB,
    "businessId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Deal_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Deal_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Deal_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "DealStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Deal_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Deal_customerId_idx" ON "Deal"("customerId");
CREATE INDEX IF NOT EXISTS "Deal_statusId_idx" ON "Deal"("statusId");
CREATE INDEX IF NOT EXISTS "Deal_businessId_idx" ON "Deal"("businessId");

-- ============================================
-- KPI・売上ロジック
-- ============================================

-- KPIテーブル
CREATE TABLE IF NOT EXISTS "KPI" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KPI_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "KPI_businessId_idx" ON "KPI"("businessId");

-- 売上ロジックテーブル
CREATE TABLE IF NOT EXISTS "RevenueLogic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "formula" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RevenueLogic_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "RevenueLogic_businessId_idx" ON "RevenueLogic"("businessId");

-- 売上ロジックエントリテーブル
CREATE TABLE IF NOT EXISTS "RevenueLogicEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "revenueLogicId" TEXT NOT NULL,
    "kpiId" TEXT,
    "coefficient" DECIMAL(15,4) NOT NULL,
    "operator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RevenueLogicEntry_revenueLogicId_fkey" FOREIGN KEY ("revenueLogicId") REFERENCES "RevenueLogic"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueLogicEntry_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "RevenueLogicEntry_revenueLogicId_idx" ON "RevenueLogicEntry"("revenueLogicId");
CREATE INDEX IF NOT EXISTS "RevenueLogicEntry_kpiId_idx" ON "RevenueLogicEntry"("kpiId");

-- ============================================
-- 事業計画
-- ============================================

-- 事業計画テーブル
CREATE TABLE IF NOT EXISTS "BusinessPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessPlan_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BusinessPlan_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BusinessPlan_businessId_scenarioId_fiscalYear_key" UNIQUE ("businessId", "scenarioId", "fiscalYear")
);

CREATE INDEX IF NOT EXISTS "BusinessPlan_businessId_idx" ON "BusinessPlan"("businessId");
CREATE INDEX IF NOT EXISTS "BusinessPlan_scenarioId_idx" ON "BusinessPlan"("scenarioId");

-- KPI計画テーブル
CREATE TABLE IF NOT EXISTS "KPIPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessPlanId" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "value" DECIMAL(15,4) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KPIPlan_businessPlanId_fkey" FOREIGN KEY ("businessPlanId") REFERENCES "BusinessPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KPIPlan_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KPIPlan_businessPlanId_kpiId_month_key" UNIQUE ("businessPlanId", "kpiId", "month")
);

CREATE INDEX IF NOT EXISTS "KPIPlan_businessPlanId_idx" ON "KPIPlan"("businessPlanId");
CREATE INDEX IF NOT EXISTS "KPIPlan_kpiId_idx" ON "KPIPlan"("kpiId");
CREATE INDEX IF NOT EXISTS "KPIPlan_month_idx" ON "KPIPlan"("month");

-- KPI実績テーブル
CREATE TABLE IF NOT EXISTS "KPIResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kpiId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DECIMAL(15,4) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KPIResult_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KPIResult_kpiId_month_year_key" UNIQUE ("kpiId", "month", "year")
);

CREATE INDEX IF NOT EXISTS "KPIResult_kpiId_idx" ON "KPIResult"("kpiId");
CREATE INDEX IF NOT EXISTS "KPIResult_month_idx" ON "KPIResult"("month");
CREATE INDEX IF NOT EXISTS "KPIResult_year_idx" ON "KPIResult"("year");

-- 売上実績テーブル
CREATE TABLE IF NOT EXISTS "RevenueResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessPlanId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "dealId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RevenueResult_businessPlanId_fkey" FOREIGN KEY ("businessPlanId") REFERENCES "BusinessPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueResult_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RevenueResult_businessPlanId_month_key" UNIQUE ("businessPlanId", "month")
);

CREATE INDEX IF NOT EXISTS "RevenueResult_businessPlanId_idx" ON "RevenueResult"("businessPlanId");
CREATE INDEX IF NOT EXISTS "RevenueResult_month_idx" ON "RevenueResult"("month");
CREATE INDEX IF NOT EXISTS "RevenueResult_dealId_idx" ON "RevenueResult"("dealId");

-- ============================================
-- 事業コスト
-- ============================================

-- 事業コスト項目テーブル
CREATE TABLE IF NOT EXISTS "BusinessCostItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessCostItem_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "BusinessCostItem_businessId_idx" ON "BusinessCostItem"("businessId");

-- 事業コスト計画テーブル
CREATE TABLE IF NOT EXISTS "BusinessCostPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessPlanId" TEXT NOT NULL,
    "costItemId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessCostPlan_businessPlanId_fkey" FOREIGN KEY ("businessPlanId") REFERENCES "BusinessPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BusinessCostPlan_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "BusinessCostItem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BusinessCostPlan_businessPlanId_costItemId_month_key" UNIQUE ("businessPlanId", "costItemId", "month")
);

CREATE INDEX IF NOT EXISTS "BusinessCostPlan_businessPlanId_idx" ON "BusinessCostPlan"("businessPlanId");
CREATE INDEX IF NOT EXISTS "BusinessCostPlan_costItemId_idx" ON "BusinessCostPlan"("costItemId");
CREATE INDEX IF NOT EXISTS "BusinessCostPlan_month_idx" ON "BusinessCostPlan"("month");

-- 事業コスト実績テーブル
CREATE TABLE IF NOT EXISTS "BusinessCostResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessPlanId" TEXT NOT NULL,
    "costItemId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BusinessCostResult_businessPlanId_fkey" FOREIGN KEY ("businessPlanId") REFERENCES "BusinessPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BusinessCostResult_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "BusinessCostItem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BusinessCostResult_businessPlanId_costItemId_month_key" UNIQUE ("businessPlanId", "costItemId", "month")
);

CREATE INDEX IF NOT EXISTS "BusinessCostResult_businessPlanId_idx" ON "BusinessCostResult"("businessPlanId");
CREATE INDEX IF NOT EXISTS "BusinessCostResult_costItemId_idx" ON "BusinessCostResult"("costItemId");
CREATE INDEX IF NOT EXISTS "BusinessCostResult_month_idx" ON "BusinessCostResult"("month");

-- ============================================
-- 人員・コーポレート計画
-- ============================================

-- 人員テーブル
CREATE TABLE IF NOT EXISTS "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "startMonth" INTEGER NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endMonth" INTEGER,
    "endYear" INTEGER,
    "businessId" TEXT,
    "scenarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Person_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Person_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Person_businessId_idx" ON "Person"("businessId");
CREATE INDEX IF NOT EXISTS "Person_scenarioId_idx" ON "Person"("scenarioId");

-- 全社コスト項目テーブル
CREATE TABLE IF NOT EXISTS "CorporateCostItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isAuto" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 全社コスト計画テーブル
CREATE TABLE IF NOT EXISTS "CorporateCostPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "costItemId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CorporateCostPlan_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CorporateCostItem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CorporateCostPlan_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CorporateCostPlan_costItemId_scenarioId_month_year_key" UNIQUE ("costItemId", "scenarioId", "month", "year")
);

CREATE INDEX IF NOT EXISTS "CorporateCostPlan_costItemId_idx" ON "CorporateCostPlan"("costItemId");
CREATE INDEX IF NOT EXISTS "CorporateCostPlan_scenarioId_idx" ON "CorporateCostPlan"("scenarioId");
CREATE INDEX IF NOT EXISTS "CorporateCostPlan_month_idx" ON "CorporateCostPlan"("month");
CREATE INDEX IF NOT EXISTS "CorporateCostPlan_year_idx" ON "CorporateCostPlan"("year");

-- 全社コスト実績テーブル
CREATE TABLE IF NOT EXISTS "CorporateCostResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "costItemId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CorporateCostResult_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CorporateCostItem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CorporateCostResult_costItemId_month_year_key" UNIQUE ("costItemId", "month", "year")
);

CREATE INDEX IF NOT EXISTS "CorporateCostResult_costItemId_idx" ON "CorporateCostResult"("costItemId");
CREATE INDEX IF NOT EXISTS "CorporateCostResult_month_idx" ON "CorporateCostResult"("month");
CREATE INDEX IF NOT EXISTS "CorporateCostResult_year_idx" ON "CorporateCostResult"("year");

-- ============================================
-- ユーザー（Supabase Auth連携）
-- ============================================

-- ユーザープロフィールテーブル
CREATE TABLE IF NOT EXISTS "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "UserProfile_userId_idx" ON "UserProfile"("userId");


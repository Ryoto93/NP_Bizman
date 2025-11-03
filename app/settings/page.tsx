"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessMasterTab } from "@/components/settings/business-master-tab";
import { ProductMasterTab } from "@/components/settings/product-master-tab";
import { DealStatusMasterTab } from "@/components/settings/deal-status-master-tab";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          設定・マスター管理
        </h1>
        <p className="text-muted-foreground">
          全社共通の情報を管理します
        </p>
      </div>
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business">事業</TabsTrigger>
          <TabsTrigger value="product">商材</TabsTrigger>
          <TabsTrigger value="deal-status">案件ステータス</TabsTrigger>
        </TabsList>
        <TabsContent value="business" className="mt-6">
          <BusinessMasterTab />
        </TabsContent>
        <TabsContent value="product" className="mt-6">
          <ProductMasterTab />
        </TabsContent>
        <TabsContent value="deal-status" className="mt-6">
          <DealStatusMasterTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}


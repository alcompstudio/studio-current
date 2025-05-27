"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Импортируем компонент контента со статусами заказов
import OrderStatusesContent from "@/components/settings/order-statuses-content";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("statuses");
  
  return (
    <div className="flex flex-col gap-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-xl font-semibold">Заказы</h1>
        <p className="text-sm text-muted-foreground">
          Управление различными настройками для заказов
        </p>
      </div>
      
      {/* Вкладки */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("statuses")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${activeTab === "statuses"
                  ? "font-semibold text-foreground border-b-[3px] border-primary"
                  : "text-muted-foreground hover:text-foreground"}`}
        >
          Статусы
        </button>
        <button
          onClick={() => setActiveTab("types")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${activeTab === "types"
                  ? "font-semibold text-foreground border-b-[3px] border-primary"
                  : "text-muted-foreground hover:text-foreground"}`}
        >
          Типы
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${activeTab === "categories"
                  ? "font-semibold text-foreground border-b-[3px] border-primary"
                  : "text-muted-foreground hover:text-foreground"}`}
        >
          Категории
        </button>
      </div>
        
      {/* Контент вкладок */}
      <div className="mt-4">
        {/* Контент вкладки "Статусы" */}
        {activeTab === "statuses" && <OrderStatusesContent />}
        
        {/* Контент вкладки "Типы" */}
        {activeTab === "types" && (
          <Card>
            <CardHeader>
              <CardTitle>Типы заказов</CardTitle>
              <CardDescription>
                Здесь будет находиться управление типами заказов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                Функциональность находится в разработке
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Контент вкладки "Категории" */}
        {activeTab === "categories" && (
          <Card>
            <CardHeader>
              <CardTitle>Категории заказов</CardTitle>
              <CardDescription>
                Здесь будет находиться управление категориями заказов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                Функциональность находится в разработке
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

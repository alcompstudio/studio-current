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

// Импортируем компоненты для работы с валютами
import type { Currency } from "@/types/currency";
import { CurrencyList } from "@/app/(app)/settings/currencies/components/currency-list";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("currencies");
  
  return (
    <div className="flex flex-col gap-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-xl font-semibold">Финансы</h1>
        <p className="text-sm text-muted-foreground">
          Управление финансовыми настройками платформы
        </p>
      </div>
      
      {/* Вкладки */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("currencies")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${activeTab === "currencies"
                  ? "font-semibold text-foreground border-b-[3px] border-primary"
                  : "text-muted-foreground hover:text-foreground"}`}
        >
          Валюты
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${activeTab === "payments"
                  ? "font-semibold text-foreground border-b-[3px] border-primary"
                  : "text-muted-foreground hover:text-foreground"}`}
        >
          Платежи
        </button>
      </div>
        
      {/* Контент вкладок */}
      <div className="mt-4">
        {/* Контент вкладки "Валюты" */}
        {activeTab === "currencies" && (
          // Используем компонент CurrencyList напрямую, чтобы избежать дублирования заголовка
          <CurrencyList />
        )}
        
        {/* Контент вкладки "Платежи" */}
        {activeTab === "payments" && (
          <Card>
            <CardHeader>
              <CardTitle>Управление платежами</CardTitle>
              <CardDescription>
                Здесь будет находиться управление платежами и платежными системами
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

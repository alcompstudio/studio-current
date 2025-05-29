"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Импортируем компоненты для работы с валютами
import type { Currency } from "@/types/currency";
import { CurrencyList } from "@/app/(app)/settings/currencies/components/currency-list";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("currencies");

  return (
    <div className="flex flex-col gap-6" data-oid="qmph19a">
      {/* Заголовок страницы */}
      <div data-oid="4rx3w8x">
        <h1 className="text-xl font-semibold" data-oid="_ml:.nc">
          Финансы
        </h1>
        <p className="text-sm text-muted-foreground" data-oid="82h40z4">
          Управление финансовыми настройками платформы
        </p>
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-border" data-oid="xo8078n">
        <button
          onClick={() => setActiveTab("currencies")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "currencies"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          data-oid="sm9w_p:"
        >
          Валюты
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "payments"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          data-oid="y88wwtf"
        >
          Платежи
        </button>
      </div>

      {/* Контент вкладок */}
      <div className="mt-4" data-oid="yu-n:5b">
        {/* Контент вкладки "Валюты" */}
        {activeTab === "currencies" && (
          // Используем компонент CurrencyList напрямую, чтобы избежать дублирования заголовка
          <CurrencyList data-oid="u_k8s2s" />
        )}

        {/* Контент вкладки "Платежи" */}
        {activeTab === "payments" && (
          <Card data-oid="a7m5qmt">
            <CardHeader data-oid="m_:.b1f">
              <CardTitle data-oid="0i27tkh">Управление платежами</CardTitle>
              <CardDescription data-oid="_ow5x1i">
                Здесь будет находиться управление платежами и платежными
                системами
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="8prw6:t">
              <div
                className="text-center p-8 text-muted-foreground"
                data-oid="tzufaou"
              >
                Функциональность находится в разработке
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

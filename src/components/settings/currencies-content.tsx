"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Currency } from "@/types/currency";

// Импортируем компоненты для отображения валют, если они существуют
import { CurrencyList } from "@/app/(app)/settings/currencies/components/currency-list";

export default function CurrenciesContent() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);

        // Запрашиваем данные из БД через API
        const response = await fetch("/api/settings/currencies");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Ошибка получения валют: ${response.statusText}`,
          );
        }

        const data = await response.json();
        setCurrencies(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch currencies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return (
    <div className="flex flex-col gap-6" data-oid="otu8qi7">
      {/* Page Header */}
      <div className="flex items-center justify-between" data-oid="oqyw-hm">
        <div data-oid="giruo2e">
          <h2 className="text-lg font-semibold" data-oid="q-w.0a1">
            Валюты
          </h2>
          <p className="text-sm text-muted-foreground" data-oid="q35p7-9">
            Управление валютами, доступными в системе
          </p>
        </div>
        <div className="flex gap-2" data-oid="v4q43h3">
          <Button asChild data-oid="h4_0hl9">
            <Link href="/settings/currencies/new" data-oid="u90e6hj">
              <Plus className="w-4 h-4 mr-2" data-oid="k:ih.o6" /> Добавить
              валюту
            </Link>
          </Button>
        </div>
      </div>

      {/* Currencies List Content */}
      <div data-oid="lth09pn">
        {isLoading && (
          <Card className="shadow-sm border-none" data-oid="f1asgnu">
            <CardContent
              className="flex items-center justify-center gap-2 py-6 text-muted-foreground"
              data-oid="ig3y:ei"
            >
              <Loader2 className="h-5 w-5 animate-spin" data-oid="ky8.uat" />
              <p data-oid="u91n9x5">Загрузка валют...</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card
            className="shadow-sm border-destructive bg-destructive/10"
            data-oid="2cniaes"
          >
            <CardContent
              className="flex items-center gap-2 text-destructive py-4"
              data-oid="hr7ajr_"
            >
              <AlertTriangle className="h-5 w-5" data-oid="_499g-j" />
              <p className="text-sm font-semibold" data-oid="gae0wab">
                Ошибка загрузки валют: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && (
          <CurrencyList initialCurrencies={currencies} data-oid="c7tw8.r" />
        )}
      </div>
    </div>
  );
}

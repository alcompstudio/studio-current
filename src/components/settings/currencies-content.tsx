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
            errorData.error ||
              `Ошибка получения валют: ${response.statusText}`,
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
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Валюты</h2>
          <p className="text-sm text-muted-foreground">
            Управление валютами, доступными в системе
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/settings/currencies/new">
              <Plus className="w-4 h-4 mr-2" /> Добавить валюту
            </Link>
          </Button>
        </div>
      </div>

      {/* Currencies List Content */}
      <div>
        {isLoading && (
          <Card className="shadow-sm border-none">
            <CardContent className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Загрузка валют...</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card className="shadow-sm border-destructive bg-destructive/10">
            <CardContent className="flex items-center gap-2 text-destructive py-4">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-semibold">
                Ошибка загрузки валют: {error}
              </p>
            </CardContent>
          </Card>
        )}
        
        {!isLoading && !error && (
          <CurrencyList initialCurrencies={currencies} />
        )}
      </div>
    </div>
  );
}

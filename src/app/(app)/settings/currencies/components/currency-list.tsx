"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, RefreshCw } from "lucide-react";
import type { Currency } from "@/types/currency";
import { CurrencyError, CurrencyLoading } from "./currency-error";
import { ViewToggle } from "@/components/status/view-toggle";
import { CurrencyCardView } from "./currency-card-view";

interface CurrencyListProps {
  initialCurrencies?: Currency[];
}

export function CurrencyList({ initialCurrencies }: CurrencyListProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCurrencies);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [view, setView] = useState<"grid" | "table">("table"); // По умолчанию - табличный вид

  const fetchCurrencies = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await fetch(`/api/settings/currencies`, {
        cache: "no-store",
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка при получении списка валют: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCurrencies(data);
    } catch (err) {
      console.error("Ошибка при загрузке валют:", err);
      setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка при загрузке валют");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!initialCurrencies) {
      fetchCurrencies();
    }
  }, [initialCurrencies]);

  if (isLoading) {
    return <CurrencyLoading message="Загрузка списка валют..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <CurrencyError error={error} retryText="Повторить загрузку" retryLink={undefined} />
        <div className="flex justify-center">
          <Button onClick={fetchCurrencies} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Повторить загрузку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Валюты</h1>
          <p className="text-sm text-muted-foreground">
            Управление валютами в системе
          </p>
        </div>
        <div className="flex gap-2">
          <ViewToggle view={view} onViewChange={setView} />
          {isRefreshing ? (
            <Button variant="outline" disabled>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </Button>
          ) : (
            <Button variant="outline" onClick={fetchCurrencies}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Обновить
            </Button>
          )}
          <Button asChild>
            <Link href="/settings/currencies/new">
              <Plus className="w-4 h-4 mr-2" />
              Добавить валюту
            </Link>
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Код</TableHead>
                <TableHead>Символ</TableHead>
                <TableHead>Курс обмена</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.length > 0 ? (
                currencies.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell>{currency.isoCode}</TableCell>
                    <TableCell>{currency.symbol}</TableCell>
                    <TableCell>{currency.exchangeRate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link href={`/settings/currencies/${currency.id}/edit`} title="Редактировать">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Нет доступных валют
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <CurrencyCardView currencies={currencies} />
      )}
    </div>
  );
}

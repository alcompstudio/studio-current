"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Edit, Plus, RefreshCw, Trash2, Loader2, AlertTriangle } from "lucide-react";
import type { Currency } from "@/types/currency";
import { CurrencyError, CurrencyLoading } from "./currency-error";
import { ViewToggle } from "@/components/status/view-toggle";
import { CurrencyCardView } from "./currency-card-view";
import { CurrencyForm } from "./currency-form";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CurrencyListProps {
  initialCurrencies?: Currency[];
}

export function CurrencyList({ initialCurrencies }: CurrencyListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCurrencies);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [view, setView] = useState<"grid" | "table">("table"); // По умолчанию - табличный вид
  const [showForm, setShowForm] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  
  // Обработчик открытия диалога подтверждения удаления
  const openDeleteDialog = (currency: Currency) => {
    setCurrencyToDelete(currency);
    setDeleteDialogOpen(true);
  };

  // Функция удаления валюты
  const handleDelete = async (currencyId: number) => {
    if (!currencyId) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/settings/currencies/${currencyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ошибка удаления валюты: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Оптимистично удаляем из UI
      setCurrencies(currencies.filter(currency => currency.id !== currencyId));
      
      toast({
        title: "Валюта удалена",
        description: data.message || "Валюта успешно удалена",
      });
      
      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error("Не удалось удалить валюту:", error);
      const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      toast({
        title: "Ошибка удаления валюты",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCurrencyToDelete(null);
    }
  };

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
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Валюты</h1>
            <p className="text-sm text-muted-foreground">
              Управление валютами в системе
            </p>
          </div>
          <div className="flex gap-2">
            {!showForm && <ViewToggle view={view} onViewChange={setView} />}
            {!showForm && isRefreshing ? (
              <Button variant="outline" disabled>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Обновление...
              </Button>
            ) : !showForm && (
              <Button variant="outline" onClick={fetchCurrencies}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Обновить
              </Button>
            )}
            {!showForm && (
              <Button onClick={() => { 
                setEditingCurrency(null); 
                setShowForm(true); 
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить валюту
              </Button>
            )}
          </div>
        </div>

        {showForm ? (
          <CurrencyForm 
            initialData={editingCurrency}
            onSave={() => {
              setShowForm(false);
              setEditingCurrency(null);
              fetchCurrencies(); // Обновляем список после сохранения
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingCurrency(null);
            }}
          />
        ) : view === "table" ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Код</TableHead>
                  <TableHead>Символ</TableHead>
                  <TableHead>Курс обмена</TableHead>
                  <TableHead className="w-[150px]">Действия</TableHead>
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCurrency(currency);
                              setShowForm(true);
                            }}
                            title="Редактировать"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!currency.isDefault && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => openDeleteDialog(currency)}
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
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

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удаление валюты</DialogTitle>
            <DialogDescription>
              {currencyToDelete ? (
                <>
                  Вы действительно хотите удалить валюту "{currencyToDelete.name}" ({currencyToDelete.isoCode})? 
                  Это действие нельзя будет отменить.
                </>
              ) : (
                "Вы действительно хотите удалить эту валюту? Это действие нельзя будет отменить."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false);
                setCurrencyToDelete(null);
              }}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => currencyToDelete && handleDelete(currencyToDelete.id)}
              disabled={isDeleting}
              className="gap-1"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

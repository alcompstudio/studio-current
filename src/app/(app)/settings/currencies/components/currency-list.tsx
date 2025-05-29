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
import {
  Edit,
  Plus,
  RefreshCw,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
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
  const [currencies, setCurrencies] = useState<Currency[]>(
    initialCurrencies || [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialCurrencies);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [view, setView] = useState<"grid" | "table">("table"); // По умолчанию - табличный вид
  const [showForm, setShowForm] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCurrencies = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      const response = await fetch(`/api/settings/currencies`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        throw new Error(
          `Ошибка при получении списка валют: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setCurrencies(data);
    } catch (err) {
      console.error("Ошибка при загрузке валют:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Произошла неизвестная ошибка при загрузке валют",
      );
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
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка удаления валюты: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Оптимистично удаляем из UI
      setCurrencies(
        currencies.filter((currency) => currency.id !== currencyId),
      );

      toast({
        title: "Валюта удалена",
        description: data.message || "Валюта успешно удалена",
      });

      router.refresh(); // Обновляем данные на странице
    } catch (error) {
      console.error("Не удалось удалить валюту:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
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
    return (
      <CurrencyLoading message="Загрузка списка валют..." data-oid="j3is85h" />
    );
  }

  if (error) {
    return (
      <div className="space-y-4" data-oid="k81:4bg">
        <CurrencyError
          error={error}
          retryText="Повторить загрузку"
          retryLink={undefined}
          data-oid="v0imf01"
        />

        <div className="flex justify-center" data-oid="-r9s3mh">
          <Button
            onClick={fetchCurrencies}
            variant="outline"
            data-oid="4h62b:6"
          >
            <RefreshCw className="mr-2 h-4 w-4" data-oid="ij8-:ty" />
            Повторить загрузку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6" data-oid="y6kp.36">
        <div className="flex items-center justify-between" data-oid="8unn6:t">
          <div data-oid="u5b4x7f">
            <h1 className="text-xl font-semibold" data-oid="f4u_nq3">
              Валюты
            </h1>
            <p className="text-sm text-muted-foreground" data-oid="vydd9iw">
              Управление валютами в системе
            </p>
          </div>
          <div className="flex gap-2" data-oid="z_r._17">
            {!showForm && (
              <ViewToggle
                view={view}
                onViewChange={setView}
                data-oid="hga70pm"
              />
            )}
            {!showForm && isRefreshing ? (
              <Button variant="outline" disabled data-oid="-t6l3ra">
                <RefreshCw
                  className="mr-2 h-4 w-4 animate-spin"
                  data-oid="pigh7dp"
                />
                Обновление...
              </Button>
            ) : (
              !showForm && (
                <Button
                  variant="outline"
                  onClick={fetchCurrencies}
                  data-oid="6qn3khm"
                >
                  <RefreshCw className="mr-2 h-4 w-4" data-oid="_nnzx3:" />
                  Обновить
                </Button>
              )
            )}
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingCurrency(null);
                  setShowForm(true);
                }}
                data-oid="m76310y"
              >
                <Plus className="w-4 h-4 mr-2" data-oid="ugffol7" />
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
            data-oid="g8t_aph"
          />
        ) : view === "table" ? (
          <Card data-oid="atp28et">
            <Table data-oid="204kx00">
              <TableHeader data-oid="pp01zej">
                <TableRow data-oid="_-r_hgo">
                  <TableHead data-oid="76-t9_2">Название</TableHead>
                  <TableHead data-oid="twq7wes">Код</TableHead>
                  <TableHead data-oid="_fdyb-y">Символ</TableHead>
                  <TableHead data-oid="m16o33d">Курс обмена</TableHead>
                  <TableHead className="w-[150px]" data-oid="wk-6avx">
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-oid="vxc49ik">
                {currencies.length > 0 ? (
                  currencies.map((currency) => (
                    <TableRow key={currency.id} data-oid="r7ov:rv">
                      <TableCell data-oid="qi-16i.">{currency.name}</TableCell>
                      <TableCell data-oid="0pqw9oq">
                        {currency.isoCode}
                      </TableCell>
                      <TableCell data-oid="78s8zu0">
                        {currency.symbol}
                      </TableCell>
                      <TableCell data-oid="5-d_dsy">
                        {currency.exchangeRate}
                      </TableCell>
                      <TableCell data-oid="x4ahon2">
                        <div
                          className="flex items-center gap-2"
                          data-oid="o-0.m2d"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCurrency(currency);
                              setShowForm(true);
                            }}
                            title="Редактировать"
                            data-oid="31y9z-b"
                          >
                            <Edit className="w-4 h-4" data-oid="pv9isd1" />
                          </Button>
                          {!currency.isDefault && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => openDeleteDialog(currency)}
                              title="Удалить"
                              data-oid="0danjny"
                            >
                              <Trash2 className="w-4 h-4" data-oid="jo11sbg" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow data-oid="qk25so:">
                    <TableCell
                      colSpan={5}
                      className="text-center py-4"
                      data-oid="f6_e-hl"
                    >
                      Нет доступных валют
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <CurrencyCardView currencies={currencies} data-oid="gj1ywr7" />
        )}
      </div>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        data-oid="y8b5ois"
      >
        <DialogContent className="sm:max-w-md" data-oid="ixczpwb">
          <DialogHeader data-oid="q:j78g3">
            <DialogTitle data-oid="-1vqn2k">Удаление валюты</DialogTitle>
            <DialogDescription data-oid="fny7wii">
              {currencyToDelete ? (
                <>
                  Вы действительно хотите удалить валюту "
                  {currencyToDelete.name}" ({currencyToDelete.isoCode})? Это
                  действие нельзя будет отменить.
                </>
              ) : (
                "Вы действительно хотите удалить эту валюту? Это действие нельзя будет отменить."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter
            className="flex items-center justify-between sm:justify-between"
            data-oid="gp-:hfz"
          >
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCurrencyToDelete(null);
              }}
              disabled={isDeleting}
              data-oid="lm940u9"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                currencyToDelete && handleDelete(currencyToDelete.id)
              }
              disabled={isDeleting}
              className="gap-1"
              data-oid="y1wr899"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    data-oid="rak_si0"
                  />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" data-oid="jzd2s.0" />
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

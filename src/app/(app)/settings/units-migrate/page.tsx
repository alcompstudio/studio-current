"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Loader2 } from "lucide-react";

export default function UnitsMigratePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    updated?: number;
    errors?: number;
  } | null>(null);

  const runMigration = async () => {
    try {
      setIsLoading(true);
      setResult(null);

      const response = await fetch("/api/settings/units-migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setResult({
        success: data.success,
        message: data.message || "Миграция выполнена",
        updated: data.updated,
        errors: data.errors,
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Произошла ошибка при выполнении миграции",
      });
      console.error("Ошибка миграции:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10" data-oid="6y:.a82">
      <h1 className="text-3xl font-bold mb-6" data-oid="a169b1b">
        Миграция данных единиц измерения
      </h1>

      <Card className="mb-6" data-oid="n5h2sk.">
        <CardHeader data-oid="3czx0xx">
          <CardTitle data-oid="vm.b:80">
            Обновление полей volume_unit_id
          </CardTitle>
          <CardDescription data-oid="xe.yeal">
            Эта страница позволяет заполнить поле volume_unit_id в опциях этапов
            заказов на основе имеющихся значений в поле volume_unit.
            Рекомендуется выполнить миграцию для обеспечения корректной работы с
            единицами измерения.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="zcejbal">
          <div className="flex flex-col gap-6" data-oid=":6cltaq">
            <div
              className="bg-yellow-50 p-4 rounded-md border border-yellow-200"
              data-oid=".c_yi-l"
            >
              <h3
                className="text-lg font-medium text-yellow-800 mb-2"
                data-oid="en632v:"
              >
                Важная информация!
              </h3>
              <p className="text-yellow-700" data-oid="0l-zgdw">
                Миграция обновит записи, у которых заполнено поле volume_unit,
                но не заполнено поле volume_unit_id. Этот процесс безопасен и не
                затрагивает другие данные в системе.
              </p>
            </div>

            {result && (
              <Alert
                variant={result.success ? "default" : "destructive"}
                className="mb-4"
                data-oid="n0.2-b_"
              >
                <div className="flex items-center gap-2" data-oid="zn.sia1">
                  {result.success ? (
                    <Check className="h-4 w-4" data-oid="7j6rd3f" />
                  ) : (
                    <AlertCircle className="h-4 w-4" data-oid="r7jrq-p" />
                  )}
                  <AlertTitle data-oid="4g3_cld">
                    {result.success ? "Миграция выполнена" : "Ошибка миграции"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2" data-oid="8:4zrxs">
                  {result.message}
                  {result.success && result.updated !== undefined && (
                    <div className="mt-2" data-oid="ryfnxmw">
                      <p data-oid="69rpu_4">
                        Обновлено записей: {result.updated}
                      </p>
                      <p data-oid="g4kvw-w">
                        Пропущено записей: {result.errors || 0}
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div data-oid="e2_mop0">
              <Button
                onClick={runMigration}
                disabled={isLoading}
                size="lg"
                data-oid="-r44b9:"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      data-oid="d3m8.54"
                    />
                    Выполнение...
                  </>
                ) : (
                  "Запустить миграцию"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CurrencyErrorProps {
  error: string;
  retryLink?: string;
  retryText?: string;
}

export function CurrencyError({
  error,
  retryLink = "/settings/currencies",
  retryText = "Вернуться к списку валют",
}: CurrencyErrorProps) {
  return (
    <Card
      className="shadow-sm border-destructive bg-destructive/10"
      data-oid="f4xq85f"
    >
      <CardHeader data-oid="sdnsjrx">
        <CardTitle className="text-destructive" data-oid="n-gx-d:">
          Ошибка
        </CardTitle>
      </CardHeader>
      <CardContent
        className="flex items-center gap-2 text-destructive py-4"
        data-oid="j-u9kzd"
      >
        <AlertTriangle className="h-5 w-5" data-oid=":o2to04" />
        <p data-oid="p9ipq05">{error}</p>
      </CardContent>
      <CardContent data-oid="7g47pvi">
        {retryLink && (
          <Link href={retryLink} data-oid="imdw2:i">
            <Button variant="outline" data-oid="0e.xrnq">
              {retryText}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

interface CurrencyLoadingProps {
  message?: string;
}

export function CurrencyLoading({
  message = "Загрузка данных...",
}: CurrencyLoadingProps) {
  return (
    <div className="flex items-center justify-center h-64" data-oid="9288pb2">
      <Loader2
        className="h-8 w-8 animate-spin text-muted-foreground"
        data-oid="6dpzhnu"
      />

      <p className="ml-2 text-muted-foreground" data-oid="b5k1g_y">
        {message}
      </p>
    </div>
  );
}

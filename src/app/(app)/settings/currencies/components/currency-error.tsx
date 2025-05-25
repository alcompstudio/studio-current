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
  retryText = "Вернуться к списку валют" 
}: CurrencyErrorProps) {
  return (
    <Card className="shadow-sm border-destructive bg-destructive/10">
      <CardHeader>
        <CardTitle className="text-destructive">Ошибка</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-destructive py-4">
        <AlertTriangle className="h-5 w-5" />
        <p>{error}</p>
      </CardContent>
      <CardContent>
        {retryLink && (
          <Link href={retryLink}>
            <Button variant="outline">
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

export function CurrencyLoading({ message = "Загрузка данных..." }: CurrencyLoadingProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="ml-2 text-muted-foreground">{message}</p>
    </div>
  );
}

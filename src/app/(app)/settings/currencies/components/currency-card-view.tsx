"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, CreditCard } from "lucide-react";
import Link from "next/link";
import type { Currency } from "@/types/currency";

interface CurrencyCardViewProps {
  currencies: Currency[];
}

export function CurrencyCardView({ currencies }: CurrencyCardViewProps) {
  return (
    <div className="space-y-4">
      {currencies.length > 0 ? (
        currencies.map((currency) => (
          <Card
            key={currency.id}
            className="shadow-sm hover:shadow-md transition-shadow border-none"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  {currency.name}
                </CardTitle>
                <div className="text-lg font-medium">
                  {currency.symbol}
                </div>
              </div>
              <CardDescription>
                Код: {currency.isoCode}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Курс обмена:</span> {currency.exchangeRate}
              </div>
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href={`/settings/currencies/${currency.id}/edit`} title="Редактировать">
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="shadow-sm border-none">
          <CardContent>
            <p className="text-sm text-muted-foreground py-4 text-center">
              Валюты не найдены. Добавьте валюту, чтобы начать работу.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

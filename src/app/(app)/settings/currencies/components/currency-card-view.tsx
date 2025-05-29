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
    <div className="space-y-4" data-oid="_ceb-l9">
      {currencies.length > 0 ? (
        currencies.map((currency) => (
          <Card
            key={currency.id}
            className="shadow-sm hover:shadow-md transition-shadow border-none"
            data-oid="ykjdb:c"
          >
            <CardHeader className="pb-3" data-oid="hqf2evg">
              <div
                className="flex justify-between items-start"
                data-oid="y3s-i67"
              >
                <CardTitle
                  className="text-lg font-semibold flex items-center"
                  data-oid="zg-3b66"
                >
                  <CreditCard
                    className="mr-2 h-5 w-5 text-primary"
                    data-oid="g1l_k2y"
                  />

                  {currency.name}
                </CardTitle>
                <div className="text-lg font-medium" data-oid="zzcieu4">
                  {currency.symbol}
                </div>
              </div>
              <CardDescription data-oid="eyzgafq">
                Код: {currency.isoCode}
              </CardDescription>
            </CardHeader>
            <CardContent
              className="flex items-center justify-between"
              data-oid="41fm9ep"
            >
              <div className="text-sm" data-oid="5aouc0l">
                <span className="text-muted-foreground" data-oid="kcq1ybc">
                  Курс обмена:
                </span>{" "}
                {currency.exchangeRate}
              </div>
              <Button variant="ghost" size="icon" asChild data-oid="h2wa80g">
                <Link
                  href={`/settings/currencies/${currency.id}/edit`}
                  title="Редактировать"
                  data-oid="zstqa2d"
                >
                  <Edit className="h-4 w-4" data-oid="flc9uxy" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="shadow-sm border-none" data-oid="qkf8e27">
          <CardContent data-oid="snkl2ly">
            <p
              className="text-sm text-muted-foreground py-4 text-center"
              data-oid="hwc2p7d"
            >
              Валюты не найдены. Добавьте валюту, чтобы начать работу.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

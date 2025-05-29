import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CurrencyForm } from "../../components/currency-form";
import type { Currency } from "@/types/currency";

export default async function EditCurrencyPage({
  params,
}: {
  params: { currencyId: string };
}) {
  // Получаем данные о валюте с сервера
  const response = await fetch(
    `/api/settings/currencies/${params.currencyId}`,
    { cache: "no-store" },
  );

  const currency: Currency = await response.json();

  return (
    <div className="flex flex-col gap-6" data-oid="c21z58w">
      <div className="flex items-center justify-between" data-oid="senjete">
        <div className="flex items-center gap-4" data-oid="82if4s3">
          <Link href="/settings/currencies" data-oid="s8rgay7">
            <Button variant="outline" size="sm" data-oid="n9vhf4i">
              <ArrowLeft className="h-4 w-4 mr-2" data-oid="gd2oyeg" /> Назад
            </Button>
          </Link>
          <h1 className="text-xl font-semibold" data-oid="mvvdbsa">
            Редактирование валюты: {currency.name}
          </h1>
        </div>
      </div>

      <CurrencyForm currency={currency} isEditing={true} data-oid="lp.p:n8" />
    </div>
  );
}

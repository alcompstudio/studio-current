import React from "react";
import type { Currency } from "@/types/currency";
import { CurrencyList } from "./components/currency-list";

/**
 * Серверный компонент для отображения списка валют
 * Использует клиентский компонент для отображения данных с обработкой ошибок
 */
export default async function CurrenciesPage() {
  // Получаем список валют из API с использованием абсолютного URL
  let initialCurrencies: Currency[] = [];
  let error = null;

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      `http://${process.env.VERCEL_URL || "localhost:3000"}`;
    const response = await fetch(`${apiUrl}/api/settings/currencies`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка при получении списка валют: ${response.statusText}`,
      );
    }

    initialCurrencies = await response.json();
  } catch (err) {
    console.error("Ошибка при загрузке валют на сервере:", err);
    // Ошибка будет обработана на клиенте, серверный компонент просто передаст пустой массив
    initialCurrencies = [];
  }

  return (
    <CurrencyList initialCurrencies={initialCurrencies} data-oid="l8wsq0o" />
  );
}

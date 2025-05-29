"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Импортируем компонент контента со статусами заказов
import OrderStatusesContent from "@/components/settings/order-statuses-content";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("statuses");

  return (
    <div className="flex flex-col gap-6" data-oid="oag1y4i">
      {/* Заголовок страницы */}
      <div data-oid="y-ab7kj">
        <h1 className="text-xl font-semibold" data-oid="4-zjn20">
          Заказы
        </h1>
        <p className="text-sm text-muted-foreground" data-oid="hkj43l2">
          Управление различными настройками для заказов
        </p>
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-border" data-oid="a.xpipc">
        <button
          onClick={() => setActiveTab("statuses")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "statuses"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          data-oid="_ufzd:."
        >
          Статусы
        </button>
        <button
          onClick={() => setActiveTab("types")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "types"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          data-oid="mf2lygn"
        >
          Типы
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "categories"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          data-oid="pxzh.n4"
        >
          Категории
        </button>
      </div>

      {/* Контент вкладок */}
      <div className="mt-4" data-oid="2e58zt9">
        {/* Контент вкладки "Статусы" */}
        {activeTab === "statuses" && (
          <OrderStatusesContent data-oid="jteomsj" />
        )}

        {/* Контент вкладки "Типы" */}
        {activeTab === "types" && (
          <Card data-oid="5iog.hf">
            <CardHeader data-oid="y_xn8o.">
              <CardTitle data-oid="_2rqxvc">Типы заказов</CardTitle>
              <CardDescription data-oid="xn5.3lo">
                Здесь будет находиться управление типами заказов
              </CardDescription>
            </CardHeader>
            <CardContent data-oid=":gvlohe">
              <div
                className="text-center p-8 text-muted-foreground"
                data-oid="09_cv7q"
              >
                Функциональность находится в разработке
              </div>
            </CardContent>
          </Card>
        )}

        {/* Контент вкладки "Категории" */}
        {activeTab === "categories" && (
          <Card data-oid="81t880_">
            <CardHeader data-oid="j5bz1d_">
              <CardTitle data-oid="o_x:oy3">Категории заказов</CardTitle>
              <CardDescription data-oid="qd-y5.j">
                Здесь будет находиться управление категориями заказов
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="-ra-q::">
              <div
                className="text-center p-8 text-muted-foreground"
                data-oid="6g1il.c"
              >
                Функциональность находится в разработке
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

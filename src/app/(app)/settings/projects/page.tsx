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

// Импортируем компонент контента со статусами проектов
import ProjectStatusesContent from "@/components/settings/project-statuses-content";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("statuses");

  return (
    <div className="flex flex-col gap-6" data-oid="ov5jzvy">
      {/* Заголовок страницы */}
      <div data-oid="cjab7i-">
        <h1 className="text-xl font-semibold" data-oid="sm81u5f">
          Проекты
        </h1>
        <p className="text-sm text-muted-foreground" data-oid="qhcc:1s">
          Управление различными настройками для проектов
        </p>
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-border" data-oid="qgmjnpt">
        <button
          onClick={() => setActiveTab("statuses")}
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "statuses"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          data-oid="r2efj8d"
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
          data-oid="5e_zjsm"
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
          data-oid="wu9dxhk"
        >
          Категории
        </button>
      </div>

      {/* Контент вкладок */}
      <div className="mt-4" data-oid="ggp:wug">
        {/* Контент вкладки "Статусы" */}
        {activeTab === "statuses" && (
          <ProjectStatusesContent data-oid="14-v.ar" />
        )}

        {/* Контент вкладки "Типы" */}
        {activeTab === "types" && (
          <Card data-oid="b6o6es9">
            <CardHeader data-oid="awn.y27">
              <CardTitle data-oid="j241ud6">Типы проектов</CardTitle>
              <CardDescription data-oid="txj-gxb">
                Здесь будет находиться управление типами проектов
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="yhogluf">
              <div
                className="text-center p-8 text-muted-foreground"
                data-oid="hsxi47e"
              >
                Функциональность находится в разработке
              </div>
            </CardContent>
          </Card>
        )}

        {/* Контент вкладки "Категории" */}
        {activeTab === "categories" && (
          <Card data-oid="6ceo7y3">
            <CardHeader data-oid="n35l.oi">
              <CardTitle data-oid="ra6nwse">Категории проектов</CardTitle>
              <CardDescription data-oid="qxyt5ah">
                Здесь будет находиться управление категориями проектов
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="oiuqb51">
              <div
                className="text-center p-8 text-muted-foreground"
                data-oid="x62.rv6"
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

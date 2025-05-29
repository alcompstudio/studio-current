"use client";

import { useState } from "react";

// Тип Project. В идеале, его следует вынести в общий файл типов (например, src/types.ts)
// и импортировать сюда, а также в page.tsx.
// Здесь он дублируется для простоты и инкапсуляции компонента.
export type Project = {
  id: number;
  title: string;
  description: string | null;
  status: number; // Теперь это ID статуса
  currency: number;
  budget: number;
  createdAt: string | null; // Изменено на camelCase и добавлен null, так как сервер может вернуть null
  updatedAt: string | null; // Изменено на camelCase и добавлен null, так как сервер может вернуть null
  customer?: {
    id: number;
    name: string;
    email: string;
  };
  projectStatus?: {
    id: number;
    name: string;
    textColor: string;
    backgroundColor: string;
  };
  currencyDetails?: {
    id: number;
    isoCode: string;
    name: string;
    symbol: string;
    exchangeRate: number;
  };
};

type ActiveTab = "info" | "description";

export default function ProjectDetailsTabs({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");

  return (
    <div className="flex flex-col gap-6" data-oid="iq3o2-l">
      {/* Вкладки */}
      <div data-oid="4sud2kq">
        <div className="flex border-b border-border" data-oid="gtg0bi:">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                        ${
                          activeTab === "info"
                            ? "font-semibold text-foreground border-b-[3px] border-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
            data-oid="welz2z-"
          >
            Основная информация
          </button>
          {project.description && (
            <button
              onClick={() => setActiveTab("description")}
              className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                          ${
                            activeTab === "description"
                              ? "font-semibold text-foreground border-b-[3px] border-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
              data-oid="gf0sizz"
            >
              Описание проекта
            </button>
          )}
        </div>

        {/* Содержимое вкладок - без внутренних отступов */}
        <div
          className="bg-card rounded-xl shadow-sm mt-4 p-6"
          data-oid="j_vukkw"
        >
          {activeTab === "info" && (
            <div data-oid="xh9uk1u">
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                data-oid=":ekdci9"
              >
                <div className="space-y-4" data-oid="mg-xj:k">
                  {project.customer && (
                    <div data-oid="r4ptbip">
                      <p
                        className="text-sm text-muted-foreground"
                        data-oid="ec.hn98"
                      >
                        Клиент
                      </p>
                      <p className="font-medium text-sm" data-oid="zd54sh9">
                        {project.customer.name}
                        {project.customer.email && (
                          <span
                            className="block text-sm text-muted-foreground"
                            data-oid="butdyo2"
                          >
                            {project.customer.email}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4" data-oid="xx-yjsk">
                  <div data-oid="ompigg_">
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="2ucvttg"
                    >
                      Бюджет
                    </p>
                    <p className="font-medium text-sm" data-oid="w8n3k9y">
                      {project.budget ? (
                        <>
                          {new Intl.NumberFormat("ru-RU", {
                            style: "decimal",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(project.budget)}{" "}
                          {project.currencyDetails?.isoCode || "RUB"}
                        </>
                      ) : (
                        "Не указан"
                      )}
                    </p>
                  </div>

                  <div data-oid="39i79xr">
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="giz9r_r"
                    >
                      ID проекта
                    </p>
                    <p className="font-medium text-sm" data-oid=":fpy3z1">
                      {project.id}
                    </p>
                  </div>

                  <div data-oid="6dqz.72">
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="6qzs78s"
                    >
                      Дата обновления
                    </p>
                    <p className="font-medium text-sm" data-oid="h7d7ltl">
                      {project.updatedAt &&
                      !isNaN(new Date(project.updatedAt).getTime())
                        ? new Date(project.updatedAt).toLocaleDateString(
                            "ru-RU",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "Не указана"}
                    </p>
                  </div>

                  <div data-oid="nllwtmk">
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="2j:2kvn"
                    >
                      Дата создания
                    </p>
                    <p className="font-medium text-sm" data-oid="08hk89i">
                      {project.createdAt &&
                      !isNaN(new Date(project.createdAt).getTime())
                        ? new Date(project.createdAt).toLocaleDateString(
                            "ru-RU",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "Не указана"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "description" && project.description && (
            <div data-oid="wjxiw4u">
              <div
                className="prose max-w-none dark:prose-invert"
                data-oid="c1t1fpx"
              >
                <p className="text-foreground text-sm" data-oid="awwolr6">
                  {project.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

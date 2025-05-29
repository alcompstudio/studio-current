"use client";

import { useState } from "react";
import Link from "next/link";
import { StageWorkTypesContent } from "@/components/settings/stages/stage-work-types-content";

export default function StagesPage() {
  // Состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState<"work-types">("work-types");

  return (
    <div className="flex flex-col gap-6" data-oid="g556-i4">
      <div data-oid="r5jf:pn">
        <h1 className="text-xl font-semibold" data-oid="gq6f1n4">
          Этапы
        </h1>
        <p className="text-sm text-muted-foreground" data-oid="-9xn5g9">
          Управление различными настройками для этапов
        </p>
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-border" data-oid=".03tqfc">
        <button
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "work-types"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          onClick={() => setActiveTab("work-types")}
          data-oid="wj3u7p0"
        >
          Тип работы
        </button>
        {/* Сюда можно добавить дополнительные вкладки в будущем */}
      </div>

      {/* Содержимое вкладок */}
      <div className="mt-4" data-oid=":6h:t2o">
        {activeTab === "work-types" && (
          <StageWorkTypesContent data-oid="zwf4cr." />
        )}
      </div>
    </div>
  );
}

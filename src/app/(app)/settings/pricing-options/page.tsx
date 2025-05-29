"use client";

import { useState } from "react";
import { PricingTypesContent } from "@/components/settings/pricing-options/pricing-types-content";

export default function PricingOptionsPage() {
  const [activeTab, setActiveTab] = useState<"pricing-types">("pricing-types");

  return (
    <div className="flex flex-col gap-6" data-oid="fb8_:um">
      <div data-oid="rf_gkz_">
        <h1 className="text-xl font-semibold" data-oid="k1g-2-s">
          Опции
        </h1>
        <p className="text-sm text-muted-foreground" data-oid="1slym3l">
          Управление настройками опций
        </p>
      </div>

      <div className="flex border-b border-border" data-oid="646-n21">
        <button
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "pricing-types"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          onClick={() => setActiveTab("pricing-types")}
          data-oid="4kzg2j9"
        >
          Тип ценообразования
        </button>
      </div>

      <div className="mt-4" data-oid="ek6a512">
        {activeTab === "pricing-types" && (
          <PricingTypesContent data-oid="4hkptuh" />
        )}
      </div>
    </div>
  );
}

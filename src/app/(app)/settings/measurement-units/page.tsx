"use client";

import { useState } from "react";
import { MeasurementUnitsContent } from "@/components/settings/measurement-units/measurement-units-content";

export default function MeasurementUnitsPage() {
  const [activeTab, setActiveTab] =
    useState<"measurement-units">("measurement-units");

  return (
    <div className="flex flex-col gap-6" data-oid=":mtr5n2">
      <div data-oid="pxu3:uv">
        <h1 className="text-xl font-semibold" data-oid="2r:59.2">
          Единицы измерения
        </h1>
        <p className="text-sm text-muted-foreground" data-oid="m8c8ym1">
          Управление единицами измерения объема
        </p>
      </div>

      <div className="flex border-b border-border" data-oid="ik9u5cx">
        <button
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === "measurement-units"
                    ? "font-semibold text-foreground border-b-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          onClick={() => setActiveTab("measurement-units")}
          data-oid="wr6s_s3"
        >
          Единицы измерения
        </button>
      </div>

      <div className="mt-4" data-oid="364ukos">
        {activeTab === "measurement-units" && (
          <MeasurementUnitsContent data-oid="w_dx5he" />
        )}
      </div>
    </div>
  );
}

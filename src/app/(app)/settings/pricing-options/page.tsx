"use client";

import { useState } from 'react';
import { PricingTypesContent } from '@/components/settings/pricing-options/pricing-types-content';

export default function PricingOptionsPage() {
  const [activeTab, setActiveTab] = useState<'pricing-types'>('pricing-types');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Опции</h1>
        <p className="text-sm text-muted-foreground">Управление настройками опций</p>
      </div>

      <div className="flex border-b border-border">
        <button
          className={`py-3 px-5 text-sm focus:outline-none transition-colors duration-150 ease-in-out -mb-px 
                ${
                  activeTab === 'pricing-types'
                    ? 'font-semibold text-foreground border-b-[3px] border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
          onClick={() => setActiveTab('pricing-types')}
        >
          Тип ценообразования
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'pricing-types' && <PricingTypesContent />}
      </div>
    </div>
  );
}

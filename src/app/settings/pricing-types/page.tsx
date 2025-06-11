import { Metadata } from 'next';
import PricingTypesManager from '@/components/settings/pricing-types/pricing-types-manager';

export const metadata: Metadata = {
  title: 'Типы ценообразования - Настройки',
  description: 'Управление типами ценообразования для опций заказов',
};

export default async function PricingTypesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Типы ценообразования
        </h1>
        <p className="text-muted-foreground">
          Управление типами ценообразования для опций заказов
        </p>
      </div>

      <PricingTypesManager />
    </div>
  );
}
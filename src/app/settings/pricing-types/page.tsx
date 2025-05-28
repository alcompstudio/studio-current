import { Metadata } from 'next';
import PricingTypesManager from '@/components/settings/pricing-types/pricing-types-manager';

export const metadata: Metadata = {
  title: 'Настройки типов ценообразования',
  description: 'Управление типами ценообразования для опций этапов',
};

export default async function PricingTypesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Настройки типов ценообразования</h1>
        <p className="text-muted-foreground">
          Управление типами ценообразования для опций этапов заказов
        </p>
      </div>
      
      <PricingTypesManager />
    </div>
  );
}

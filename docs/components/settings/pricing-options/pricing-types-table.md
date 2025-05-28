# Документация для `pricing-types-table.tsx`

*Путь к файлу: `src/components\settings\pricing-options\pricing-types-table.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    pricing_types_table_tsx[pricing-types-table.tsx]
    button[@/components/ui/button]
    pricing_types_table_tsx --> button
    card[@/components/ui/card]
    pricing_types_table_tsx --> card
    table[@/components/ui/table]
    pricing_types_table_tsx --> table
    lucide_react[lucide-react]
    pricing_types_table_tsx --> lucide_react
    pricing[@/types/pricing]
    pricing_types_table_tsx --> pricing
```

### `PricingTypesTable` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `items` | `PricingType[]` | Да |  |
| `onEdit` | `(item: PricingType) => void` | Да |  |
| `onDelete` | `(id: number) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\pricing-options\pricing-types-table.tsx`*

---

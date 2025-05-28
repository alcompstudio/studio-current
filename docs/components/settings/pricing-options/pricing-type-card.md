# Документация для `pricing-type-card.tsx`

*Путь к файлу: `src/components\settings\pricing-options\pricing-type-card.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    pricing_type_card_tsx[pricing-type-card.tsx]
    button[@/components/ui/button]
    pricing_type_card_tsx --> button
    card[@/components/ui/card]
    pricing_type_card_tsx --> card
    lucide_react[lucide-react]
    pricing_type_card_tsx --> lucide_react
    pricing[@/types/pricing]
    pricing_type_card_tsx --> pricing
```

### `PricingTypeCard` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `item` | `PricingType` | Да |  |
| `onEdit` | `(item: PricingType) => void` | Да |  |
| `onDelete` | `(id: number) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\pricing-options\pricing-type-card.tsx`*

---

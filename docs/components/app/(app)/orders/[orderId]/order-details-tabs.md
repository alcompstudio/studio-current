# Документация для `order-details-tabs.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\order-details-tabs.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    order_details_tabs_tsx[order-details-tabs.tsx]
    react[react]
    order_details_tabs_tsx --> react
    card[@/components/ui/card]
    order_details_tabs_tsx --> card
    badge[@/components/ui/badge]
    order_details_tabs_tsx --> badge
    lucide_react[lucide-react]
    order_details_tabs_tsx --> lucide_react
    types[@/lib/types]
    order_details_tabs_tsx --> types
    order[@/lib/types/order]
    order_details_tabs_tsx --> order
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `order` | `Order` | Да |  |
| `orderStatuses` | `OrderStatusOS[]` | Да |  |
| `projects` | `{ id: number; title: string; currency?: string }[]` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\order-details-tabs.tsx`*

---

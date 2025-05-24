# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\orders\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    card[@/components/ui/card]
    page_tsx --> card
    button[@/components/ui/button]
    page_tsx --> button
    badge[@/components/ui/badge]
    page_tsx --> badge
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    types[@/lib/types]
    page_tsx --> types
    order[@/lib/types/order]
    page_tsx --> order
    link[next/link]
    page_tsx --> link
    getOrderStatusVariant[./getOrderStatusVariant]
    page_tsx --> getOrderStatusVariant
    utils[@/lib/utils]
    page_tsx --> utils
    delete_order_dialog[@/components/orders/delete-order-dialog]
    page_tsx --> delete_order_dialog
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\page.tsx`*

---

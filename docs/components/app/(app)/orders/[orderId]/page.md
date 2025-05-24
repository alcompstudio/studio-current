# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    button[@/components/ui/button]
    page_tsx --> button
    badge[@/components/ui/badge]
    page_tsx --> badge
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    link[next/link]
    page_tsx --> link
    navigation[next/navigation]
    page_tsx --> navigation
    types[@/lib/types]
    page_tsx --> types
    order[@/lib/types/order]
    page_tsx --> order
    use_toast[@/hooks/use-toast]
    page_tsx --> use_toast
    delete_order_dialog[@/components/orders/delete-order-dialog]
    page_tsx --> delete_order_dialog
    order_details_tabs[./order-details-tabs]
    page_tsx --> order_details_tabs
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\page.tsx`*

---

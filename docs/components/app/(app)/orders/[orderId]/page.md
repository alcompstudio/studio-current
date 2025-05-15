# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    card[@/components/ui/card]
    page_tsx --> card
    badge[@/components/ui/badge]
    page_tsx --> badge
    button[@/components/ui/button]
    page_tsx --> button
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    link[next/link]
    page_tsx --> link
    navigation[next/navigation]
    page_tsx --> navigation
    types[@/lib/types]
    page_tsx --> types
    use_toast[@/hooks/use-toast]
    page_tsx --> use_toast
    mockOrders[../mockOrders]
    page_tsx --> mockOrders
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\page.tsx`*

---

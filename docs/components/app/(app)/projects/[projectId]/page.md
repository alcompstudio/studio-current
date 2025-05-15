# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\projects\[projectId]\page.tsx`*

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
    mockProjects[../mockProjects]
    page_tsx --> mockProjects
    mockOrders[../../orders/mockOrders]
    page_tsx --> mockOrders
    use_toast[@/hooks/use-toast]
    page_tsx --> use_toast
    utils[@/lib/utils]
    page_tsx --> utils
    tabs[@/components/ui/tabs]
    page_tsx --> tabs
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\projects\[projectId]\page.tsx`*

---

# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\projects\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    button[@/components/ui/button]
    page_tsx --> button
    card[@/components/ui/card]
    page_tsx --> card
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    badge[@/components/ui/badge]
    page_tsx --> badge
    link[next/link]
    page_tsx --> link
    utils[@/lib/utils]
    page_tsx --> utils
    react[react]
    page_tsx --> react
    types[@/lib/types]
    page_tsx --> types
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\projects\page.tsx`*

---

# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\settings\finance\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    card[@/components/ui/card]
    page_tsx --> card
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    link[next/link]
    page_tsx --> link
    currency[@/types/currency]
    page_tsx --> currency
    currency_list[@/app/(app)/settings/currencies/components/currency-list]
    page_tsx --> currency_list
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\settings\finance\page.tsx`*

---

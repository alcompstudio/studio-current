# Документация для `currencies-content.tsx`

*Путь к файлу: `src/components\settings\currencies-content.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    currencies_content_tsx[currencies-content.tsx]
    react[react]
    currencies_content_tsx --> react
    button[@/components/ui/button]
    currencies_content_tsx --> button
    card[@/components/ui/card]
    currencies_content_tsx --> card
    lucide_react[lucide-react]
    currencies_content_tsx --> lucide_react
    link[next/link]
    currencies_content_tsx --> link
    currency[@/types/currency]
    currencies_content_tsx --> currency
    currency_list[@/app/(app)/settings/currencies/components/currency-list]
    currencies_content_tsx --> currency_list
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\currencies-content.tsx`*

---

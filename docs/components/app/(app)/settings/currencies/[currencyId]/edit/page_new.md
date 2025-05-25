# Документация для `page_new.tsx`

*Путь к файлу: `src/app\(app)\settings\currencies\[currencyId]\edit\page_new.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_new_tsx[page_new.tsx]
    react[react]
    page_new_tsx --> react
    link[next/link]
    page_new_tsx --> link
    button[@/components/ui/button]
    page_new_tsx --> button
    lucide_react[lucide-react]
    page_new_tsx --> lucide_react
    currency_form[../../components/currency-form]
    page_new_tsx --> currency_form
    currency[@/types/currency]
    page_new_tsx --> currency
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `params` | `{ currencyId: string }` | Да |  |

**Возвращает:** `Promise<React.JSX.Element>`

*Источник: `src/app\(app)\settings\currencies\[currencyId]\edit\page_new.tsx`*

---

# Документация для `currency-edit-page.tsx`

*Путь к файлу: `src/app\(app)\settings\currencies\[currencyId]\edit\currency-edit-page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    currency_edit_page_tsx[currency-edit-page.tsx]
    react[react]
    currency_edit_page_tsx --> react
    link[next/link]
    currency_edit_page_tsx --> link
    button[@/components/ui/button]
    currency_edit_page_tsx --> button
    lucide_react[lucide-react]
    currency_edit_page_tsx --> lucide_react
    currency_form[../../components/currency-form]
    currency_edit_page_tsx --> currency_form
    currency[@/types/currency]
    currency_edit_page_tsx --> currency
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `params` | `{ currencyId: string }` | Да |  |

**Возвращает:** `Promise<React.JSX.Element>`

*Источник: `src/app\(app)\settings\currencies\[currencyId]\edit\currency-edit-page.tsx`*

---

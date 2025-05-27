# Документация для `currency-list.tsx`

*Путь к файлу: `src/app\(app)\settings\currencies\components\currency-list.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    currency_list_tsx[currency-list.tsx]
    react[react]
    currency_list_tsx --> react
    link[next/link]
    currency_list_tsx --> link
    navigation[next/navigation]
    currency_list_tsx --> navigation
    button[@/components/ui/button]
    currency_list_tsx --> button
    card[@/components/ui/card]
    currency_list_tsx --> card
    table[@/components/ui/table]
    currency_list_tsx --> table
    lucide_react[lucide-react]
    currency_list_tsx --> lucide_react
    currency[@/types/currency]
    currency_list_tsx --> currency
    currency_error[./currency-error]
    currency_list_tsx --> currency_error
    view_toggle[@/components/status/view-toggle]
    currency_list_tsx --> view_toggle
    currency_card_view[./currency-card-view]
    currency_list_tsx --> currency_card_view
    currency_form[./currency-form]
    currency_list_tsx --> currency_form
    use_toast[@/hooks/use-toast]
    currency_list_tsx --> use_toast
    dialog[@/components/ui/dialog]
    currency_list_tsx --> dialog
```

### `CurrencyList` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `initialCurrencies` | `Currency[]` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\settings\currencies\components\currency-list.tsx`*

---

# Документация для `currency-form.tsx`

*Путь к файлу: `src/app\(app)\settings\currencies\components\currency-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    currency_form_tsx[currency-form.tsx]
    react[react]
    currency_form_tsx --> react
    navigation[next/navigation]
    currency_form_tsx --> navigation
    zod[@hookform/resolvers/zod]
    currency_form_tsx --> zod
    react_hook_form[react-hook-form]
    currency_form_tsx --> react_hook_form
    zod[zod]
    currency_form_tsx --> zod
    button[@/components/ui/button]
    currency_form_tsx --> button
    form[@/components/ui/form]
    currency_form_tsx --> form
    input[@/components/ui/input]
    currency_form_tsx --> input
    use_toast[@/hooks/use-toast]
    currency_form_tsx --> use_toast
    currency[@/types/currency]
    currency_form_tsx --> currency
    card[@/components/ui/card]
    currency_form_tsx --> card
    lucide_react[lucide-react]
    currency_form_tsx --> lucide_react
```

### `CurrencyForm` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `initialData` | `Currency \| null` | Нет |  |
| `onSave` | `() => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\settings\currencies\components\currency-form.tsx`*

---

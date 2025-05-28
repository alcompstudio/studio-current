# Документация для `pricing-type-form.tsx`

*Путь к файлу: `src/components\settings\pricing-options\pricing-type-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    pricing_type_form_tsx[pricing-type-form.tsx]
    react[react]
    pricing_type_form_tsx --> react
    button[@/components/ui/button]
    pricing_type_form_tsx --> button
    card[@/components/ui/card]
    pricing_type_form_tsx --> card
    form[@/components/ui/form]
    pricing_type_form_tsx --> form
    input[@/components/ui/input]
    pricing_type_form_tsx --> input
    lucide_react[lucide-react]
    pricing_type_form_tsx --> lucide_react
    react_hook_form[react-hook-form]
    pricing_type_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    pricing_type_form_tsx --> zod
    zod[zod]
    pricing_type_form_tsx --> zod
    use_toast[@/hooks/use-toast]
    pricing_type_form_tsx --> use_toast
    pricing[@/types/pricing]
    pricing_type_form_tsx --> pricing
```

### `PricingTypeForm` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `initialData` | `PricingType \| null` | Нет |  |
| `onSave` | `() => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\pricing-options\pricing-type-form.tsx`*

---

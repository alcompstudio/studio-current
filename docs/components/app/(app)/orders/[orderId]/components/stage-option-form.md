# Документация для `stage-option-form.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\components\stage-option-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    stage_option_form_tsx[stage-option-form.tsx]
    react[react]
    stage_option_form_tsx --> react
    react_hook_form[react-hook-form]
    stage_option_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    stage_option_form_tsx --> zod
    form[@/components/ui/form]
    stage_option_form_tsx --> form
    input[@/components/ui/input]
    stage_option_form_tsx --> input
    textarea[@/components/ui/textarea]
    stage_option_form_tsx --> textarea
    button[@/components/ui/button]
    stage_option_form_tsx --> button
    select[@/components/ui/select]
    stage_option_form_tsx --> select
    use_toast[@/hooks/use-toast]
    stage_option_form_tsx --> use_toast
    lucide_react[lucide-react]
    stage_option_form_tsx --> lucide_react
    types[./types]
    stage_option_form_tsx --> types
    volume_fields[./volume-fields]
    stage_option_form_tsx --> volume_fields
    price_fields[./price-fields]
    stage_option_form_tsx --> price_fields
    price_calculation[./price-calculation]
    stage_option_form_tsx --> price_calculation
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `orderId` | `string` | Да |  |
| `stageId` | `string` | Да |  |
| `optionToEdit` | `StageOption \| null` | Нет |  |
| `onSuccess` | `() => void` | Да |  |
| `onCancel` | `() => void` | Да |  |
| `orderCurrency` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\components\stage-option-form.tsx`*

---

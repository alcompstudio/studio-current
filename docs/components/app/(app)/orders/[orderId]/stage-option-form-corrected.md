# Документация для `stage-option-form-corrected.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\stage-option-form-corrected.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    stage_option_form_corrected_tsx[stage-option-form-corrected.tsx]
    react[react]
    stage_option_form_corrected_tsx --> react
    zod[zod]
    stage_option_form_corrected_tsx --> zod
    react_hook_form[react-hook-form]
    stage_option_form_corrected_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    stage_option_form_corrected_tsx --> zod
    form[@/components/ui/form]
    stage_option_form_corrected_tsx --> form
    input[@/components/ui/input]
    stage_option_form_corrected_tsx --> input
    textarea[@/components/ui/textarea]
    stage_option_form_corrected_tsx --> textarea
    button[@/components/ui/button]
    stage_option_form_corrected_tsx --> button
    select[@/components/ui/select]
    stage_option_form_corrected_tsx --> select
    stage[@/lib/types/stage]
    stage_option_form_corrected_tsx --> stage
    use_toast[@/hooks/use-toast]
    stage_option_form_corrected_tsx --> use_toast
    lucide_react[lucide-react]
    stage_option_form_corrected_tsx --> lucide_react
```

### `StageOptionFormValues` (TypeAlias)

*Источник: `src/app\(app)\orders\[orderId]\stage-option-form-corrected.tsx`*

---
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

*Источник: `src/app\(app)\orders\[orderId]\stage-option-form-corrected.tsx`*

---

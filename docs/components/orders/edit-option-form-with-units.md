# Документация для `edit-option-form-with-units.tsx`

*Путь к файлу: `src/components\orders\edit-option-form-with-units.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    edit_option_form_with_units_tsx[edit-option-form-with-units.tsx]
    react[react]
    edit_option_form_with_units_tsx --> react
    react_hook_form[react-hook-form]
    edit_option_form_with_units_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    edit_option_form_with_units_tsx --> zod
    zod[zod]
    edit_option_form_with_units_tsx --> zod
    form[@/components/ui/form]
    edit_option_form_with_units_tsx --> form
    input[@/components/ui/input]
    edit_option_form_with_units_tsx --> input
    textarea[@/components/ui/textarea]
    edit_option_form_with_units_tsx --> textarea
    button[@/components/ui/button]
    edit_option_form_with_units_tsx --> button
    select[@/components/ui/select]
    edit_option_form_with_units_tsx --> select
    stage[@/lib/types/stage]
    edit_option_form_with_units_tsx --> stage
    use_toast[@/hooks/use-toast]
    edit_option_form_with_units_tsx --> use_toast
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `etapId` | `string` | Да |  |
| `option` | `StageOption` | Да |  |
| `currency` | `string` | Да |  |
| `onOptionUpdated` | `(updatedOption: StageOption) => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\orders\edit-option-form-with-units.tsx`*

---

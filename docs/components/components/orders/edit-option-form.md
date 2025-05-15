# Документация для `edit-option-form.tsx`

*Путь к файлу: `src/components\orders\edit-option-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    edit_option_form_tsx[edit-option-form.tsx]
    react[react]
    edit_option_form_tsx --> react
    react_hook_form[react-hook-form]
    edit_option_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    edit_option_form_tsx --> zod
    zod[zod]
    edit_option_form_tsx --> zod
    form[@/components/ui/form]
    edit_option_form_tsx --> form
    input[@/components/ui/input]
    edit_option_form_tsx --> input
    textarea[@/components/ui/textarea]
    edit_option_form_tsx --> textarea
    checkbox[@/components/ui/checkbox]
    edit_option_form_tsx --> checkbox
    button[@/components/ui/button]
    edit_option_form_tsx --> button
    types[@/lib/types]
    edit_option_form_tsx --> types
    use_toast[@/hooks/use-toast]
    edit_option_form_tsx --> use_toast
    utils[@/lib/utils]
    edit_option_form_tsx --> utils
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `etapId` | `string` | Да |  |
| `option` | `EtapOption` | Да |  |
| `currency` | `string` | Да |  |
| `onOptionUpdated` | `(updatedOption: EtapOption) => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\orders\edit-option-form.tsx`*

---

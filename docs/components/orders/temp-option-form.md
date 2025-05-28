# Документация для `temp-option-form.tsx`

*Путь к файлу: `src/components\orders\temp-option-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    temp_option_form_tsx[temp-option-form.tsx]
    react[react]
    temp_option_form_tsx --> react
    react_hook_form[react-hook-form]
    temp_option_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    temp_option_form_tsx --> zod
    zod[zod]
    temp_option_form_tsx --> zod
    form[@/components/ui/form]
    temp_option_form_tsx --> form
    input[@/components/ui/input]
    temp_option_form_tsx --> input
    textarea[@/components/ui/textarea]
    temp_option_form_tsx --> textarea
    button[@/components/ui/button]
    temp_option_form_tsx --> button
    select[@/components/ui/select]
    temp_option_form_tsx --> select
    stage[@/lib/types/stage]
    temp_option_form_tsx --> stage
    use_toast[@/hooks/use-toast]
    temp_option_form_tsx --> use_toast
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

*Источник: `src/components\orders\temp-option-form.tsx`*

---

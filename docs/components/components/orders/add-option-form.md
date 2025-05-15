# Документация для `add-option-form.tsx`

*Путь к файлу: `src/components\orders\add-option-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    add_option_form_tsx[add-option-form.tsx]
    react[react]
    add_option_form_tsx --> react
    react_hook_form[react-hook-form]
    add_option_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    add_option_form_tsx --> zod
    zod[zod]
    add_option_form_tsx --> zod
    form[@/components/ui/form]
    add_option_form_tsx --> form
    input[@/components/ui/input]
    add_option_form_tsx --> input
    textarea[@/components/ui/textarea]
    add_option_form_tsx --> textarea
    checkbox[@/components/ui/checkbox]
    add_option_form_tsx --> checkbox
    button[@/components/ui/button]
    add_option_form_tsx --> button
    types[@/lib/types]
    add_option_form_tsx --> types
    use_toast[@/hooks/use-toast]
    add_option_form_tsx --> use_toast
    utils[@/lib/utils]
    add_option_form_tsx --> utils
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `etapId` | `string` | Да |  |
| `currency` | `string` | Да |  |
| `onOptionAdded` | `(newOptionData: Omit<EtapOption, 'id' \| 'etapId' \| 'createdAt' \| 'updatedAt' \| 'calculatedPlanPrice'>) => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\orders\add-option-form.tsx`*

---

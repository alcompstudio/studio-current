# Документация для `edit-etap-form.tsx`

*Путь к файлу: `src/components\orders\edit-etap-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    edit_etap_form_tsx[edit-etap-form.tsx]
    react[react]
    edit_etap_form_tsx --> react
    react_hook_form[react-hook-form]
    edit_etap_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    edit_etap_form_tsx --> zod
    zod[zod]
    edit_etap_form_tsx --> zod
    form[@/components/ui/form]
    edit_etap_form_tsx --> form
    input[@/components/ui/input]
    edit_etap_form_tsx --> input
    textarea[@/components/ui/textarea]
    edit_etap_form_tsx --> textarea
    select[@/components/ui/select]
    edit_etap_form_tsx --> select
    button[@/components/ui/button]
    edit_etap_form_tsx --> button
    types[@/lib/types]
    edit_etap_form_tsx --> types
    use_toast[@/hooks/use-toast]
    edit_etap_form_tsx --> use_toast
    utils[@/lib/utils]
    edit_etap_form_tsx --> utils
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `etap` | `Etap` | Да |  |
| `currency` | `string` | Да |  |
| `onEtapUpdated` | `(updatedEtap: Etap) => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\orders\edit-etap-form.tsx`*

---

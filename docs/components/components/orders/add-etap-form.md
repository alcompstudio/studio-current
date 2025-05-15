# Документация для `add-etap-form.tsx`

*Путь к файлу: `src/components\orders\add-etap-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    add_etap_form_tsx[add-etap-form.tsx]
    react[react]
    add_etap_form_tsx --> react
    react_hook_form[react-hook-form]
    add_etap_form_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    add_etap_form_tsx --> zod
    zod[zod]
    add_etap_form_tsx --> zod
    form[@/components/ui/form]
    add_etap_form_tsx --> form
    input[@/components/ui/input]
    add_etap_form_tsx --> input
    textarea[@/components/ui/textarea]
    add_etap_form_tsx --> textarea
    select[@/components/ui/select]
    add_etap_form_tsx --> select
    button[@/components/ui/button]
    add_etap_form_tsx --> button
    types[@/lib/types]
    add_etap_form_tsx --> types
    use_toast[@/hooks/use-toast]
    add_etap_form_tsx --> use_toast
    utils[@/lib/utils]
    add_etap_form_tsx --> utils
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `orderId` | `string` | Да |  |
| `currency` | `string` | Да |  |
| `onEtapAdded` | `(newEtapData: Omit<Etap, 'id' \| 'createdAt' \| 'updatedAt' \| 'options'>) => void` | Да |  |
| `onCancel` | `() => void` | Да |  |
| `isSaveDisabled` | `boolean` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\orders\add-etap-form.tsx`*

---

# Документация для `auth-form.tsx`

*Путь к файлу: `src/components\auth\auth-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    auth_form_tsx[auth-form.tsx]
    react[react]
    auth_form_tsx --> react
    zod[@hookform/resolvers/zod]
    auth_form_tsx --> zod
    react_hook_form[react-hook-form]
    auth_form_tsx --> react_hook_form
    zod[zod]
    auth_form_tsx --> zod
    button[@/components/ui/button]
    auth_form_tsx --> button
    form[@/components/ui/form]
    auth_form_tsx --> form
    input[@/components/ui/input]
    auth_form_tsx --> input
    radio_group[@/components/ui/radio-group]
    auth_form_tsx --> radio_group
    label[@/components/ui/label]
    auth_form_tsx --> label
    utils[@/lib/utils]
    auth_form_tsx --> utils
    types[@/lib/types]
    auth_form_tsx --> types
    use_toast[@/hooks/use-toast]
    auth_form_tsx --> use_toast
    navigation[next/navigation]
    auth_form_tsx --> navigation
```

### `AuthForm` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\auth\auth-form.tsx`*

---

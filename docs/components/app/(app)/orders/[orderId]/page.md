# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    card[@/components/ui/card]
    page_tsx --> card
    badge[@/components/ui/badge]
    page_tsx --> badge
    button[@/components/ui/button]
    page_tsx --> button
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    link[next/link]
    page_tsx --> link
    navigation[next/navigation]
    page_tsx --> navigation
    types[@/lib/types]
    page_tsx --> types
    mockOrders[../mockOrders]
    page_tsx --> mockOrders
    use_toast[@/hooks/use-toast]
    page_tsx --> use_toast
    accordion[@/components/ui/accordion]
    page_tsx --> accordion
    separator[@/components/ui/separator]
    page_tsx --> separator
    add_etap_form[@/components/orders/add-etap-form]
    page_tsx --> add_etap_form
    edit_etap_form[@/components/orders/edit-etap-form]
    page_tsx --> edit_etap_form
    add_option_form[@/components/orders/add-option-form]
    page_tsx --> add_option_form
    edit_option_form[@/components/orders/edit-option-form]
    page_tsx --> edit_option_form
    utils[@/lib/utils]
    page_tsx --> utils
    avatar[@/components/ui/avatar]
    page_tsx --> avatar
    tabs[@/components/ui/tabs]
    page_tsx --> tabs
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\page.tsx`*

---

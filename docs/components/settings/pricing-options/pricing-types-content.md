# Документация для `pricing-types-content.tsx`

*Путь к файлу: `src/components\settings\pricing-options\pricing-types-content.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    pricing_types_content_tsx[pricing-types-content.tsx]
    react[react]
    pricing_types_content_tsx --> react
    button[@/components/ui/button]
    pricing_types_content_tsx --> button
    card[@/components/ui/card]
    pricing_types_content_tsx --> card
    lucide_react[lucide-react]
    pricing_types_content_tsx --> lucide_react
    alert_dialog[@/components/ui/alert-dialog]
    pricing_types_content_tsx --> alert_dialog
    navigation[next/navigation]
    pricing_types_content_tsx --> navigation
    view_toggle[@/components/status/view-toggle]
    pricing_types_content_tsx --> view_toggle
    use_toast[@/hooks/use-toast]
    pricing_types_content_tsx --> use_toast
    pricing_type_form[./pricing-type-form]
    pricing_types_content_tsx --> pricing_type_form
    pricing_types_table[./pricing-types-table]
    pricing_types_content_tsx --> pricing_types_table
    pricing_type_card[./pricing-type-card]
    pricing_types_content_tsx --> pricing_type_card
    pricing[@/types/pricing]
    pricing_types_content_tsx --> pricing
```

### `PricingTypesContent` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\pricing-options\pricing-types-content.tsx`*

---

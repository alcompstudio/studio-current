# Документация для `order-stages-tab.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\order-stages-tab.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    order_stages_tab_tsx[order-stages-tab.tsx]
    react[react]
    order_stages_tab_tsx --> react
    card[@/components/ui/card]
    order_stages_tab_tsx --> card
    badge[@/components/ui/badge]
    order_stages_tab_tsx --> badge
    button[@/components/ui/button]
    order_stages_tab_tsx --> button
    stage[@/lib/types/stage]
    order_stages_tab_tsx --> stage
    use_toast[@/hooks/use-toast]
    order_stages_tab_tsx --> use_toast
    lucide_react[lucide-react]
    order_stages_tab_tsx --> lucide_react
    stage_form[./stage-form]
    order_stages_tab_tsx --> stage_form
    delete_stage_button[./delete-stage-button]
    order_stages_tab_tsx --> delete_stage_button
    utils[@/lib/utils]
    order_stages_tab_tsx --> utils
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `orderId` | `string` | Да |  |
| `projectCurrency` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\order-stages-tab.tsx`*

---

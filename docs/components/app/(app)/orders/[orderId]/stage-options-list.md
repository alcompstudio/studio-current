# Документация для `stage-options-list.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\stage-options-list.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    stage_options_list_tsx[stage-options-list.tsx]
    react[react]
    stage_options_list_tsx --> react
    button[@/components/ui/button]
    stage_options_list_tsx --> button
    stage[@/lib/types/stage]
    stage_options_list_tsx --> stage
    use_toast[@/hooks/use-toast]
    stage_options_list_tsx --> use_toast
    lucide_react[lucide-react]
    stage_options_list_tsx --> lucide_react
    stage_option_form[./stage-option-form]
    stage_options_list_tsx --> stage_option_form
    alert_dialog[@/components/ui/alert-dialog]
    stage_options_list_tsx --> alert_dialog
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `orderId` | `string` | Да |  |
| `stageId` | `string` | Да |  |
| `orderCurrency` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\stage-options-list.tsx`*

---

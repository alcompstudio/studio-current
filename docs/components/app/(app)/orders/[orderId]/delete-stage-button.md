# Документация для `delete-stage-button.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\delete-stage-button.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    delete_stage_button_tsx[delete-stage-button.tsx]
    react[react]
    delete_stage_button_tsx --> react
    lucide_react[lucide-react]
    delete_stage_button_tsx --> lucide_react
    button[@/components/ui/button]
    delete_stage_button_tsx --> button
    use_toast[@/hooks/use-toast]
    delete_stage_button_tsx --> use_toast
    alert_dialog[@/components/ui/alert-dialog]
    delete_stage_button_tsx --> alert_dialog
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `stageId` | `string` | Да |  |
| `stageName` | `string` | Да |  |
| `orderId` | `string` | Да |  |
| `onSuccess` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\delete-stage-button.tsx`*

---

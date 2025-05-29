# Документация для `delete-order-dialog.tsx`

*Путь к файлу: `src/components\orders\delete-order-dialog.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    delete_order_dialog_tsx[delete-order-dialog.tsx]
    react[react]
    delete_order_dialog_tsx --> react
    lucide_react[lucide-react]
    delete_order_dialog_tsx --> lucide_react
    navigation[next/navigation]
    delete_order_dialog_tsx --> navigation
    button[@/components/ui/button]
    delete_order_dialog_tsx --> button
    alert_dialog[@/components/ui/alert-dialog]
    delete_order_dialog_tsx --> alert_dialog
```

### `DeleteOrderDialog` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `orderId` | `string \| number` | Да |  |
| `className` | `string` | Нет |  |
| `variant` | `\| "outline"
    \| "ghost"
    \| "link"
    \| "default"
    \| "destructive"
    \| "secondary"
    \| null
    \| undefined` | Нет |  |
| `size` | `"default" \| "sm" \| "lg" \| "icon" \| null \| undefined` | Нет |  |
| `children` | `ReactNode` | Нет |  |
| `buttonClassName` | `string` | Нет |  |
| `onDeleteSuccess` | `() => void` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\orders\delete-order-dialog.tsx`*

---

# Документация для `delete-project-dialog.tsx`

*Путь к файлу: `src/components\projects\delete-project-dialog.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    delete_project_dialog_tsx[delete-project-dialog.tsx]
    react[react]
    delete_project_dialog_tsx --> react
    lucide_react[lucide-react]
    delete_project_dialog_tsx --> lucide_react
    navigation[next/navigation]
    delete_project_dialog_tsx --> navigation
    button[@/components/ui/button]
    delete_project_dialog_tsx --> button
    alert_dialog[@/components/ui/alert-dialog]
    delete_project_dialog_tsx --> alert_dialog
```

### `DeleteProjectDialog` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `projectId` | `string \| number` | Да |  |
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

*Источник: `src/components\projects\delete-project-dialog.tsx`*

---

# Документация для `status-table.tsx`

*Путь к файлу: `src/components\status\status-table.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    status_table_tsx[status-table.tsx]
    table[@/components/ui/table]
    status_table_tsx --> table
    button[@/components/ui/button]
    status_table_tsx --> button
    lucide_react[lucide-react]
    status_table_tsx --> lucide_react
    link[next/link]
    status_table_tsx --> link
    card[@/components/ui/card]
    status_table_tsx --> card
```

### `StatusTable` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `items` | `StatusItem[]` | Да |  |
| `basePath` | `string` | Да |  |
| `onDelete` | `(id: number) => void` | Да |  |
| `onEdit` | `(item: StatusItem) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\status\status-table.tsx`*

---

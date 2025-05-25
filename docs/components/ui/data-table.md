# Документация для `data-table.tsx`

*Путь к файлу: `src/components\ui\data-table.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    data_table_tsx[data-table.tsx]
    react[react]
    data_table_tsx --> react
    table[@/components/ui/table]
    data_table_tsx --> table
    input[@/components/ui/input]
    data_table_tsx --> input
    button[@/components/ui/button]
    data_table_tsx --> button
    lucide_react[lucide-react]
    data_table_tsx --> lucide_react
    react_table[@tanstack/react-table]
    data_table_tsx --> react_table
```

### `DataTable` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `columns` | `ColumnDef<TData, TValue>[]` | Да |  |
| `data` | `TData[]` | Да |  |
| `searchKey` | `string` | Нет |  |
| `pagination` | `boolean` | Нет |  |
| `pageSize` | `number` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\data-table.tsx`*

---

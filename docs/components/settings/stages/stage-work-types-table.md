# Документация для `stage-work-types-table.tsx`

*Путь к файлу: `src/components\settings\stages\stage-work-types-table.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    stage_work_types_table_tsx[stage-work-types-table.tsx]
    button[@/components/ui/button]
    stage_work_types_table_tsx --> button
    card[@/components/ui/card]
    stage_work_types_table_tsx --> card
    table[@/components/ui/table]
    stage_work_types_table_tsx --> table
    lucide_react[lucide-react]
    stage_work_types_table_tsx --> lucide_react
```

### `StageWorkTypesTable` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `items` | `WorkType[]` | Да |  |
| `onEdit` | `(item: WorkType) => void` | Да |  |
| `onDelete` | `(id: number) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\stages\stage-work-types-table.tsx`*

---

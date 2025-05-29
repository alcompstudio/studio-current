# Документация для `measurement-units-table.tsx`

*Путь к файлу: `src/components\settings\measurement-units\measurement-units-table.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    measurement_units_table_tsx[measurement-units-table.tsx]
    table[@/components/ui/table]
    measurement_units_table_tsx --> table
    button[@/components/ui/button]
    measurement_units_table_tsx --> button
    lucide_react[lucide-react]
    measurement_units_table_tsx --> lucide_react
    date_fns[date-fns]
    measurement_units_table_tsx --> date_fns
    locale[date-fns/locale]
    measurement_units_table_tsx --> locale
    card[@/components/ui/card]
    measurement_units_table_tsx --> card
    measurement_units_content[./measurement-units-content]
    measurement_units_table_tsx --> measurement_units_content
```

### `MeasurementUnitsTable` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `items` | `MeasurementUnit[]` | Да |  |
| `onEdit` | `(unit: MeasurementUnit) => void` | Да |  |
| `onDelete` | `(id: number) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\measurement-units\measurement-units-table.tsx`*

---

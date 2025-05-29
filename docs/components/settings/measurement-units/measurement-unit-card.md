# Документация для `measurement-unit-card.tsx`

*Путь к файлу: `src/components\settings\measurement-units\measurement-unit-card.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    measurement_unit_card_tsx[measurement-unit-card.tsx]
    card[@/components/ui/card]
    measurement_unit_card_tsx --> card
    button[@/components/ui/button]
    measurement_unit_card_tsx --> button
    lucide_react[lucide-react]
    measurement_unit_card_tsx --> lucide_react
    date_fns[date-fns]
    measurement_unit_card_tsx --> date_fns
    locale[date-fns/locale]
    measurement_unit_card_tsx --> locale
    measurement_units_content[./measurement-units-content]
    measurement_unit_card_tsx --> measurement_units_content
```

### `MeasurementUnitCard` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `item` | `MeasurementUnit` | Да |  |
| `onEdit` | `(unit: MeasurementUnit) => void` | Да |  |
| `onDelete` | `(id: number) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\measurement-units\measurement-unit-card.tsx`*

---

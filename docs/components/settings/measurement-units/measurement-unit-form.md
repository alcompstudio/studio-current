# Документация для `measurement-unit-form.tsx`

*Путь к файлу: `src/components\settings\measurement-units\measurement-unit-form.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    measurement_unit_form_tsx[measurement-unit-form.tsx]
    react[react]
    measurement_unit_form_tsx --> react
    zod[@hookform/resolvers/zod]
    measurement_unit_form_tsx --> zod
    react_hook_form[react-hook-form]
    measurement_unit_form_tsx --> react_hook_form
    zod[zod]
    measurement_unit_form_tsx --> zod
    button[@/components/ui/button]
    measurement_unit_form_tsx --> button
    form[@/components/ui/form]
    measurement_unit_form_tsx --> form
    input[@/components/ui/input]
    measurement_unit_form_tsx --> input
    card[@/components/ui/card]
    measurement_unit_form_tsx --> card
    lucide_react[lucide-react]
    measurement_unit_form_tsx --> lucide_react
    use_toast[@/hooks/use-toast]
    measurement_unit_form_tsx --> use_toast
    measurement_units_content[./measurement-units-content]
    measurement_unit_form_tsx --> measurement_units_content
```

### `MeasurementUnitForm` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `initialData` | `MeasurementUnit \| null` | Да |  |
| `onSave` | `() => void` | Да |  |
| `onCancel` | `() => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\settings\measurement-units\measurement-unit-form.tsx`*

---

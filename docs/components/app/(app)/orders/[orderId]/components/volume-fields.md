# Документация для `volume-fields.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\components\volume-fields.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    volume_fields_tsx[volume-fields.tsx]
    react[react]
    volume_fields_tsx --> react
    react_hook_form[react-hook-form]
    volume_fields_tsx --> react_hook_form
    form[@/components/ui/form]
    volume_fields_tsx --> form
    input[@/components/ui/input]
    volume_fields_tsx --> input
    select[@/components/ui/select]
    volume_fields_tsx --> select
    types[./types]
    volume_fields_tsx --> types
```

### `VolumeFields` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `form` | `UseFormReturn<StageOptionFormValues>` | Да |  |
| `units` | `VolumeUnit[]` | Да |  |
| `loadingUnits` | `boolean` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\components\volume-fields.tsx`*

---
### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `form` | `UseFormReturn<StageOptionFormValues>` | Да |  |
| `units` | `VolumeUnit[]` | Да |  |
| `loadingUnits` | `boolean` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\components\volume-fields.tsx`*

---

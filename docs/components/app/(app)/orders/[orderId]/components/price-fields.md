# Документация для `price-fields.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\components\price-fields.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    price_fields_tsx[price-fields.tsx]
    react[react]
    price_fields_tsx --> react
    react_hook_form[react-hook-form]
    price_fields_tsx --> react_hook_form
    input[@/components/ui/input]
    price_fields_tsx --> input
    types[./types]
    price_fields_tsx --> types
```

### `PriceFields` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `form` | `UseFormReturn<StageOptionFormValues>` | Да |  |
| `units` | `VolumeUnit[]` | Да |  |
| `orderCurrency` | `string` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\components\price-fields.tsx`*

---
### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `form` | `UseFormReturn<StageOptionFormValues>` | Да |  |
| `units` | `VolumeUnit[]` | Да |  |
| `orderCurrency` | `string` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\components\price-fields.tsx`*

---

# Документация для `price-calculation.tsx`

*Путь к файлу: `src/app\(app)\orders\[orderId]\components\price-calculation.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    price_calculation_tsx[price-calculation.tsx]
    react[react]
    price_calculation_tsx --> react
    react_hook_form[react-hook-form]
    price_calculation_tsx --> react_hook_form
    types[./types]
    price_calculation_tsx --> types
```

### `PriceCalculation` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `calculatedPrices` | `CalculatedPrices` | Да |  |
| `form` | `UseFormReturn<StageOptionFormValues>` | Да |  |
| `units` | `VolumeUnit[]` | Да |  |
| `orderCurrency` | `string` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\components\price-calculation.tsx`*

---
### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `calculatedPrices` | `CalculatedPrices` | Да |  |
| `form` | `UseFormReturn<StageOptionFormValues>` | Да |  |
| `units` | `VolumeUnit[]` | Да |  |
| `orderCurrency` | `string` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\orders\[orderId]\components\price-calculation.tsx`*

---

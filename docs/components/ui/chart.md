# Документация для `chart.tsx`

*Путь к файлу: `src/components\ui\chart.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    chart_tsx[chart.tsx]
    react[react]
    chart_tsx --> react
    recharts[recharts]
    chart_tsx --> recharts
    utils[@/lib/utils]
    chart_tsx --> utils
```

### `ChartConfig` (TypeAlias)

*Источник: `src/components\ui\chart.tsx`*

---
### `ChartContainer` (Variable (CallExpression))

*Источник: `src/components\ui\chart.tsx`*

---
### `ChartTooltip` (Variable (PropertyAccessExpression))

*Источник: `src/components\ui\chart.tsx`*

---
### `ChartTooltipContent` (Variable (CallExpression))

*Источник: `src/components\ui\chart.tsx`*

---
### `ChartLegend` (Variable (PropertyAccessExpression))

*Источник: `src/components\ui\chart.tsx`*

---
### `ChartLegendContent` (Variable (CallExpression))

*Источник: `src/components\ui\chart.tsx`*

---
### `ChartStyle` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `id` | `string` | Да |  |
| `config` | `ChartConfig` | Да |  |

**Возвращает:** `React.JSX.Element \| null`

*Источник: `src/components\ui\chart.tsx`*

---

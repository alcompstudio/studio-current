# Документация для `currency-card-view.tsx`

*Путь к файлу: `src/app\(app)\settings\currencies\components\currency-card-view.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    currency_card_view_tsx[currency-card-view.tsx]
    react[react]
    currency_card_view_tsx --> react
    card[@/components/ui/card]
    currency_card_view_tsx --> card
    button[@/components/ui/button]
    currency_card_view_tsx --> button
    lucide_react[lucide-react]
    currency_card_view_tsx --> lucide_react
    link[next/link]
    currency_card_view_tsx --> link
    currency[@/types/currency]
    currency_card_view_tsx --> currency
```

### `CurrencyCardView` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `currencies` | `Currency[]` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\settings\currencies\components\currency-card-view.tsx`*

---

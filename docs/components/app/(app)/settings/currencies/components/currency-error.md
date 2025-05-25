# Документация для `currency-error.tsx`

*Путь к файлу: `src/app\(app)\settings\currencies\components\currency-error.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    currency_error_tsx[currency-error.tsx]
    react[react]
    currency_error_tsx --> react
    lucide_react[lucide-react]
    currency_error_tsx --> lucide_react
    card[@/components/ui/card]
    currency_error_tsx --> card
    button[@/components/ui/button]
    currency_error_tsx --> button
    link[next/link]
    currency_error_tsx --> link
```

### `CurrencyError` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `error` | `string` | Да |  |
| `retryLink` | `string` | Нет |  |
| `retryText` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\settings\currencies\components\currency-error.tsx`*

---
### `CurrencyLoading` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `message` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\settings\currencies\components\currency-error.tsx`*

---

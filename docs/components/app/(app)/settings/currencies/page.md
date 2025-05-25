# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\settings\currencies\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    currency[@/types/currency]
    page_tsx --> currency
    currency_list[./components/currency-list]
    page_tsx --> currency_list
```

### `default` (ReactComponent)

**Описание:**

> Серверный компонент для отображения списка валют
> Использует клиентский компонент для отображения данных с обработкой ошибок

**Возвращает:** `Promise<React.JSX.Element>`

*Источник: `src/app\(app)\settings\currencies\page.tsx`*

---

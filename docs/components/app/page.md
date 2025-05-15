# Документация для `page.tsx`

*Путь к файлу: `src/app\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    navigation[next/navigation]
    page_tsx --> navigation
    types[@/lib/types]
    page_tsx --> types
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element \| null`

*Источник: `src/app\page.tsx`*

---

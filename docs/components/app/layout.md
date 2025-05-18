# Документация для `layout.tsx`

*Путь к файлу: `src/app\layout.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    layout_tsx[layout.tsx]
    next[next]
    layout_tsx --> next
    globals_css[./globals.css]
    layout_tsx --> globals_css
    toaster_client[@/components/layout/toaster-client]
    layout_tsx --> toaster_client
    utils[@/lib/utils]
    layout_tsx --> utils
    fonts[@/utils/fonts]
    layout_tsx --> fonts
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `children` | `React.ReactNode` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\layout.tsx`*

---
### `metadata` (Variable (ObjectLiteralExpression))

*Источник: `src/app\layout.tsx`*

---

# Документация для `view-toggle.tsx`

*Путь к файлу: `src/components\status\view-toggle.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    view_toggle_tsx[view-toggle.tsx]
    button[@/components/ui/button]
    view_toggle_tsx --> button
    lucide_react[lucide-react]
    view_toggle_tsx --> lucide_react
```

### `ViewToggle` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `view` | `"grid" \| "table"` | Да |  |
| `onViewChange` | `(view: "grid" \| "table") => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\status\view-toggle.tsx`*

---

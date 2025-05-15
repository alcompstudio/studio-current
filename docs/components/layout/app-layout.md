# Документация для `app-layout.tsx`

*Путь к файлу: `src/components\layout\app-layout.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    app_layout_tsx[app-layout.tsx]
    react[react]
    app_layout_tsx --> react
    sidebar[@/components/ui/sidebar]
    app_layout_tsx --> sidebar
    header[@/components/layout/header]
    app_layout_tsx --> header
    communication_panel[@/components/layout/communication-panel]
    app_layout_tsx --> communication_panel
    lucide_react[lucide-react]
    app_layout_tsx --> lucide_react
    link[next/link]
    app_layout_tsx --> link
    navigation[next/navigation]
    app_layout_tsx --> navigation
    scroll_area[@/components/ui/scroll-area]
    app_layout_tsx --> scroll_area
    types[@/lib/types]
    app_layout_tsx --> types
    avatar[@/components/ui/avatar]
    app_layout_tsx --> avatar
    utils[@/lib/utils]
    app_layout_tsx --> utils
    button[@/components/ui/button]
    app_layout_tsx --> button
    use_toast[@/hooks/use-toast]
    app_layout_tsx --> use_toast
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `children` | `React.ReactNode` | Да |  |

**Возвращает:** `React.JSX.Element \| null`

*Источник: `src/components\layout\app-layout.tsx`*

---

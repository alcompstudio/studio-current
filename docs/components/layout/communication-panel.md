# Документация для `communication-panel.tsx`

*Путь к файлу: `src/components\layout\communication-panel.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    communication_panel_tsx[communication-panel.tsx]
    react[react]
    communication_panel_tsx --> react
    tabs[@/components/ui/tabs]
    communication_panel_tsx --> tabs
    lucide_react[lucide-react]
    communication_panel_tsx --> lucide_react
    scroll_area[@/components/ui/scroll-area]
    communication_panel_tsx --> scroll_area
    separator[@/components/ui/separator]
    communication_panel_tsx --> separator
    input[@/components/ui/input]
    communication_panel_tsx --> input
    button[@/components/ui/button]
    communication_panel_tsx --> button
    avatar[@/components/ui/avatar]
    communication_panel_tsx --> avatar
```

### `CommunicationPanel` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `isExpanded` | `boolean` | Да |  |
| `setIsExpanded` | `(isExpanded: boolean) => void` | Да |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\layout\communication-panel.tsx`*

---

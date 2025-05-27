# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\settings\projects\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    card[@/components/ui/card]
    page_tsx --> card
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    link[next/link]
    page_tsx --> link
    project_statuses_content[@/components/settings/project-statuses-content]
    page_tsx --> project_statuses_content
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\settings\projects\page.tsx`*

---

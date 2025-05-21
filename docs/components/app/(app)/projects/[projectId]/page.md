# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\projects\[projectId]\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    navigation[next/navigation]
    page_tsx --> navigation
    link[next/link]
    page_tsx --> link
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    button[@/components/ui/button]
    page_tsx --> button
    project_details_tabs[./project-details-tabs]
    page_tsx --> project_details_tabs
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `params` | `{
    projectId: string;
  }` | Да |  |

**Возвращает:** `Promise<React.JSX.Element>`

*Источник: `src/app\(app)\projects\[projectId]\page.tsx`*

---

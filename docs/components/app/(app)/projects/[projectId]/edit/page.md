# Документация для `page.tsx`

*Путь к файлу: `src/app\(app)\projects\[projectId]\edit\page.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    page_tsx[page.tsx]
    react[react]
    page_tsx --> react
    card[@/components/ui/card]
    page_tsx --> card
    button[@/components/ui/button]
    page_tsx --> button
    lucide_react[lucide-react]
    page_tsx --> lucide_react
    link[next/link]
    page_tsx --> link
    navigation[next/navigation]
    page_tsx --> navigation
    react_hook_form[react-hook-form]
    page_tsx --> react_hook_form
    zod[@hookform/resolvers/zod]
    page_tsx --> zod
    zod[zod]
    page_tsx --> zod
    form[@/components/ui/form]
    page_tsx --> form
    input[@/components/ui/input]
    page_tsx --> input
    textarea[@/components/ui/textarea]
    page_tsx --> textarea
    QuillEditorWrapper[@/components/editor/quill/QuillEditorWrapper]
    page_tsx --> QuillEditorWrapper
    label[@/components/ui/label]
    page_tsx --> label
    select[@/components/ui/select]
    page_tsx --> select
    types[@/types]
    page_tsx --> types
    use_toast[@/hooks/use-toast]
    page_tsx --> use_toast
```

### `default` (ReactComponent)

**Возвращает:** `React.JSX.Element`

*Источник: `src/app\(app)\projects\[projectId]\edit\page.tsx`*

---

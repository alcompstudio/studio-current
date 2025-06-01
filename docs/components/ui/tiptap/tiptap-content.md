# Документация для `tiptap-content.tsx`

*Путь к файлу: `src/components\ui\tiptap\tiptap-content.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    tiptap_content_tsx[tiptap-content.tsx]
    react[react]
    tiptap_content_tsx --> react
    types[./types]
    tiptap_content_tsx --> types
    tiptap_editor_css[./tiptap-editor.css]
    tiptap_content_tsx --> tiptap_editor_css
```

### `TiptapContent` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `content` | `string \| null` | Да |  |
| `className` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element \| null`

*Источник: `src/components\ui\tiptap\tiptap-content.tsx`*

---

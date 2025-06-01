# Документация для `QuillEditor.tsx`

*Путь к файлу: `src/components\editor\quill\QuillEditor.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    QuillEditor_tsx[QuillEditor.tsx]
    react[react]
    QuillEditor_tsx --> react
    form[@/components/ui/form]
    QuillEditor_tsx --> form
    utils[@/lib/utils]
    QuillEditor_tsx --> utils
    quill_font_fixes_css[./quill-font-fixes.css]
    QuillEditor_tsx --> quill_font_fixes_css
```

### `default` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `value` | `string` | Да |  |
| `onChange` | `(value: string) => void` | Да |  |
| `placeholder` | `string` | Нет |  |
| `label` | `string` | Нет |  |
| `className` | `string` | Нет |  |
| `toolbarType` | `QuillToolbarType` | Нет |  |
| `error` | `string` | Нет |  |
| `id` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\editor\quill\QuillEditor.tsx`*

---
### `QuillToolbarType` (EnumDeclaration)

*Источник: `src/components\editor\quill\QuillEditor.tsx`*

---

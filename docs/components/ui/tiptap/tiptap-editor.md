# Документация для `tiptap-editor.tsx`

*Путь к файлу: `src/components\ui\tiptap\tiptap-editor.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    tiptap_editor_tsx[tiptap-editor.tsx]
    react[react]
    tiptap_editor_tsx --> react
    react_hook_form[react-hook-form]
    tiptap_editor_tsx --> react_hook_form
    QuillEditorWrapper[@/components/editor/quill/QuillEditorWrapper]
    tiptap_editor_tsx --> QuillEditorWrapper
    types[./types]
    tiptap_editor_tsx --> types
    tiptap_editor_css[./tiptap-editor.css]
    tiptap_editor_tsx --> tiptap_editor_css
    custom_tiptap_css[./custom-tiptap.css]
    tiptap_editor_tsx --> custom_tiptap_css
```

### `TiptapEditor` (ReactComponent)

**Описание:**

> Компонент редактора TipTap с интеграцией react-hook-form
> и конфигурируемой панелью инструментов

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `name` | `FieldPath<TFieldValues>` | Да |  |
| `control` | `Control<TFieldValues>` | Да |  |
| `placeholder` | `string` | Нет |  |
| `className` | `string` | Нет |  |
| `editorClassName` | `string` | Нет |  |
| `defaultToolbarConfig` | `ToolbarConfigType` | Нет |  |
| `onImageUpload` | `(file: File) => Promise<UploadedImage>` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\tiptap\tiptap-editor.tsx`*

---

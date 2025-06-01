# Документация для `QuillEditorWrapper.tsx`

*Путь к файлу: `src/components\editor\quill\QuillEditorWrapper.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    QuillEditorWrapper_tsx[QuillEditorWrapper.tsx]
    react[react]
    QuillEditorWrapper_tsx --> react
    QuillEditor[./QuillEditor]
    QuillEditorWrapper_tsx --> QuillEditor
    types[@/components/ui/tiptap/types]
    QuillEditorWrapper_tsx --> types
```

### `QuillEditorWrapper` (ReactComponent)

**Описание:**

> Компонент-обертка для QuillEditor, совместимый с интерфейсом TiptapEditorCore
> для простой замены редактора

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `content` | `string` | Да |  |
| `onChange` | `(content: string) => void` | Да |  |
| `placeholder` | `string` | Нет |  |
| `className` | `string` | Нет |  |
| `editorClassName` | `string` | Нет |  |
| `defaultToolbarConfig` | `'minimal' \| 'medium' \| 'full'` | Нет |  |
| `onImageUpload` | `(file: File) => Promise<UploadedImage>` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\editor\quill\QuillEditorWrapper.tsx`*

---

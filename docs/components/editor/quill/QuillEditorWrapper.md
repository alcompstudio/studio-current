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
    image[@/types/image]
    QuillEditorWrapper_tsx --> image
    react_hook_form[react-hook-form]
    QuillEditorWrapper_tsx --> react_hook_form
```

### `QuillEditorWrapper` (ReactComponent)

**Описание:**

> Компонент-обертка для QuillEditor, совместимый с интерфейсом react-hook-form
> для простой замены редактора

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `name` | `FieldPath<TFieldValues>` | Нет |  |
| `control` | `Control<TFieldValues>` | Нет |  |
| `content` | `string` | Нет |  |
| `onChange` | `(content: string) => void` | Нет |  |
| `placeholder` | `string` | Нет |  |
| `className` | `string` | Нет |  |
| `editorClassName` | `string` | Нет |  |
| `defaultToolbarConfig` | `'minimal' \| 'medium' \| 'full'` | Нет |  |
| `onImageUpload` | `(file: File) => Promise<UploadedImage>` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\editor\quill\QuillEditorWrapper.tsx`*

---

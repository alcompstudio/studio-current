# Документация для `FormQuillEditor.tsx`

*Путь к файлу: `src/components\editor\quill\FormQuillEditor.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    FormQuillEditor_tsx[FormQuillEditor.tsx]
    react[react]
    FormQuillEditor_tsx --> react
    react_hook_form[react-hook-form]
    FormQuillEditor_tsx --> react_hook_form
    QuillEditor[./QuillEditor]
    FormQuillEditor_tsx --> QuillEditor
```

### `FormQuillEditor` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `name` | `string` | Да |  |
| `label` | `string` | Нет |  |
| `placeholder` | `string` | Нет |  |
| `className` | `string` | Нет |  |
| `defaultToolbarType` | `QuillToolbarType` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\editor\quill\FormQuillEditor.tsx`*

---

# Документация для `index.ts`

*Путь к файлу: `src/components\ui\tiptap\index.ts`*

## Зависимости файла


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

*Источник: `src/components\ui\tiptap\index.ts`*

---
### `TiptapContent` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `content` | `string \| null` | Да |  |
| `className` | `string` | Нет |  |

**Возвращает:** `React.JSX.Element \| null`

*Источник: `src/components\ui\tiptap\index.ts`*

---
### `ToolbarConfigType` (TypeAlias)

*Источник: `src/components\ui\tiptap\index.ts`*

---
### `UploadedImage` (Interface)

*Источник: `src/components\ui\tiptap\index.ts`*

---
### `MenuBarProps` (Interface)

*Источник: `src/components\ui\tiptap\index.ts`*

---
### `TiptapEditorProps` (Interface)

*Источник: `src/components\ui\tiptap\index.ts`*

---
### `TiptapContentProps` (Interface)

*Источник: `src/components\ui\tiptap\index.ts`*

---

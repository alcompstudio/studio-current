# Документация для `tiptap-editor-core.tsx`

*Путь к файлу: `src/components\ui\tiptap\components\tiptap-editor-core.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    tiptap_editor_core_tsx[tiptap-editor-core.tsx]
    react[react]
    tiptap_editor_core_tsx --> react
    react[@tiptap/react]
    tiptap_editor_core_tsx --> react
    starter_kit[@tiptap/starter-kit]
    tiptap_editor_core_tsx --> starter_kit
    extension_image[@tiptap/extension-image]
    tiptap_editor_core_tsx --> extension_image
    extension_link[@tiptap/extension-link]
    tiptap_editor_core_tsx --> extension_link
    extension_placeholder[@tiptap/extension-placeholder]
    tiptap_editor_core_tsx --> extension_placeholder
    extension_underline[@tiptap/extension-underline]
    tiptap_editor_core_tsx --> extension_underline
    extension_text_align[@tiptap/extension-text-align]
    tiptap_editor_core_tsx --> extension_text_align
    extension_color[@tiptap/extension-color]
    tiptap_editor_core_tsx --> extension_color
    extension_text_style[@tiptap/extension-text-style]
    tiptap_editor_core_tsx --> extension_text_style
    extension_highlight[@tiptap/extension-highlight]
    tiptap_editor_core_tsx --> extension_highlight
    extension_table[@tiptap/extension-table]
    tiptap_editor_core_tsx --> extension_table
    extension_table_cell[@tiptap/extension-table-cell]
    tiptap_editor_core_tsx --> extension_table_cell
    extension_table_header[@tiptap/extension-table-header]
    tiptap_editor_core_tsx --> extension_table_header
    extension_table_row[@tiptap/extension-table-row]
    tiptap_editor_core_tsx --> extension_table_row
    extension_subscript[@tiptap/extension-subscript]
    tiptap_editor_core_tsx --> extension_subscript
    extension_superscript[@tiptap/extension-superscript]
    tiptap_editor_core_tsx --> extension_superscript
    extension_typography[@tiptap/extension-typography]
    tiptap_editor_core_tsx --> extension_typography
    extension_font_family[@tiptap/extension-font-family]
    tiptap_editor_core_tsx --> extension_font_family
    extension_task_list[@tiptap/extension-task-list]
    tiptap_editor_core_tsx --> extension_task_list
    extension_task_item[@tiptap/extension-task-item]
    tiptap_editor_core_tsx --> extension_task_item
    extension_strike[@tiptap/extension-strike]
    tiptap_editor_core_tsx --> extension_strike
    extension_youtube[@tiptap/extension-youtube]
    tiptap_editor_core_tsx --> extension_youtube
    extension_character_count[@tiptap/extension-character-count]
    tiptap_editor_core_tsx --> extension_character_count
    extension_hard_break[@tiptap/extension-hard-break]
    tiptap_editor_core_tsx --> extension_hard_break
    menu_bar[./menu-bar]
    tiptap_editor_core_tsx --> menu_bar
    types[../types]
    tiptap_editor_core_tsx --> types
```

### `TiptapEditorCore` (ReactComponent)

**Описание:**

> Основной компонент редактора Tiptap с расширениями и панелью инструментов

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

*Источник: `src/components\ui\tiptap\components\tiptap-editor-core.tsx`*

---

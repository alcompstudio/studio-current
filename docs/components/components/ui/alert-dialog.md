# Документация для `alert-dialog.tsx`

*Путь к файлу: `src/components\ui\alert-dialog.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    alert_dialog_tsx[alert-dialog.tsx]
    react[react]
    alert_dialog_tsx --> react
    react_alert_dialog[@radix-ui/react-alert-dialog]
    alert_dialog_tsx --> react_alert_dialog
    utils[@/lib/utils]
    alert_dialog_tsx --> utils
    button[@/components/ui/button]
    alert_dialog_tsx --> button
```

### `AlertDialog` (Variable (PropertyAccessExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogPortal` (Variable (PropertyAccessExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogOverlay` (Variable (CallExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogTrigger` (Variable (PropertyAccessExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogContent` (Variable (CallExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogHeader` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `defaultChecked` | `boolean \| undefined` | Нет |  |
| `defaultValue` | `string \| number \| readonly string[] \| undefined` | Нет |  |
| `suppressContentEditableWarning` | `boolean \| undefined` | Нет |  |
| `suppressHydrationWarning` | `boolean \| undefined` | Нет |  |
| `accessKey` | `string \| undefined` | Нет |  |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| undefined \| (string & {})` | Нет |  |
| `autoFocus` | `boolean \| undefined` | Нет |  |
| `className` | `string \| undefined` | Нет |  |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` | Нет |  |
| `contextMenu` | `string \| undefined` | Нет |  |
| `dir` | `string \| undefined` | Нет |  |
| `draggable` | `Booleanish \| undefined` | Нет |  |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` | Нет |  |
| `hidden` | `boolean \| undefined` | Нет |  |
| `id` | `string \| undefined` | Нет |  |
| `lang` | `string \| undefined` | Нет |  |
| `nonce` | `string \| undefined` | Нет |  |
| `slot` | `string \| undefined` | Нет |  |
| `spellCheck` | `Booleanish \| undefined` | Нет |  |
| `style` | `CSSProperties \| undefined` | Нет |  |
| `tabIndex` | `number \| undefined` | Нет |  |
| `title` | `string \| undefined` | Нет |  |
| `translate` | `"yes" \| "no" \| undefined` | Нет |  |
| `radioGroup` | `string \| undefined` | Нет |  |
| `role` | `AriaRole \| undefined` | Нет |  |
| `about` | `string \| undefined` | Нет |  |
| `content` | `string \| undefined` | Нет |  |
| `datatype` | `string \| undefined` | Нет |  |
| `inlist` | `any` | Нет |  |
| `prefix` | `string \| undefined` | Нет |  |
| `property` | `string \| undefined` | Нет |  |
| `rel` | `string \| undefined` | Нет |  |
| `resource` | `string \| undefined` | Нет |  |
| `rev` | `string \| undefined` | Нет |  |
| `typeof` | `string \| undefined` | Нет |  |
| `vocab` | `string \| undefined` | Нет |  |
| `autoCorrect` | `string \| undefined` | Нет |  |
| `autoSave` | `string \| undefined` | Нет |  |
| `color` | `string \| undefined` | Нет |  |
| `itemProp` | `string \| undefined` | Нет |  |
| `itemScope` | `boolean \| undefined` | Нет |  |
| `itemType` | `string \| undefined` | Нет |  |
| `itemID` | `string \| undefined` | Нет |  |
| `itemRef` | `string \| undefined` | Нет |  |
| `results` | `number \| undefined` | Нет |  |
| `security` | `string \| undefined` | Нет |  |
| `unselectable` | `"on" \| "off" \| undefined` | Нет |  |
| `inputMode` | `"none" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| "search" \| undefined` | Нет | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | `string \| undefined` | Нет | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | `string \| undefined` | Нет |  |
| `part` | `string \| undefined` | Нет |  |
| `popover` | `"" \| "auto" \| "manual" \| undefined` | Нет |  |
| `popoverTargetAction` | `"toggle" \| "show" \| "hide" \| undefined` | Нет |  |
| `popoverTarget` | `string \| undefined` | Нет |  |
| `onToggle` | `ToggleEventHandler<T> \| undefined` | Нет |  |
| `onBeforeToggle` | `ToggleEventHandler<T> \| undefined` | Нет |  |
| `inert` | `boolean \| undefined` | Нет |  |
| `tw` | `string` | Нет | Specify styles using Tailwind CSS classes. This feature is currently experimental.
If `style` prop is also specified, styles generated with `tw` prop will be overridden.

Example:
- `tw='w-full h-full bg-blue-200'`
- `tw='text-9xl'`
- `tw='text-[80px]'` |
| `aria-activedescendant` | `string \| undefined` | Нет | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | `Booleanish \| undefined` | Нет | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | `"none" \| "inline" \| "list" \| "both" \| undefined` | Нет | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
presented if they are made. |
| `aria-braillelabel` | `string \| undefined` | Нет | Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. |
| `aria-brailleroledescription` | `string \| undefined` | Нет | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | `Booleanish \| undefined` | Нет |  |
| `aria-checked` | `boolean \| "false" \| "mixed" \| "true" \| undefined` | Нет | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | `number \| undefined` | Нет | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | `number \| undefined` | Нет | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | `string \| undefined` | Нет | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | `number \| undefined` | Нет | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | `string \| undefined` | Нет | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | `boolean \| "false" \| "true" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Нет | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | `string \| undefined` | Нет | Identifies the element (or elements) that describes the object. |
| `aria-description` | `string \| undefined` | Нет | Defines a string value that describes or annotates the current element. |
| `aria-details` | `string \| undefined` | Нет | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | `Booleanish \| undefined` | Нет | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | `"none" \| "copy" \| "execute" \| "link" \| "move" \| "popup" \| undefined` | Нет | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | `string \| undefined` | Нет | Identifies the element that provides an error message for the object. |
| `aria-expanded` | `Booleanish \| undefined` | Нет | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | `string \| undefined` | Нет | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | `Booleanish \| undefined` | Нет | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | `boolean \| "false" \| "true" \| "menu" \| "listbox" \| "tree" \| "grid" \| "dialog" \| undefined` | Нет | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | `Booleanish \| undefined` | Нет | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | `boolean \| "false" \| "true" \| "grammar" \| "spelling" \| undefined` | Нет | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | `string \| undefined` | Нет | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | `string \| undefined` | Нет | Defines a string value that labels the current element. |
| `aria-labelledby` | `string \| undefined` | Нет | Identifies the element (or elements) that labels the current element. |
| `aria-level` | `number \| undefined` | Нет | Defines the hierarchical level of an element within a structure. |
| `aria-live` | `"off" \| "assertive" \| "polite" \| undefined` | Нет | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | `Booleanish \| undefined` | Нет | Indicates whether an element is modal when displayed. |
| `aria-multiline` | `Booleanish \| undefined` | Нет | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | `Booleanish \| undefined` | Нет | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | `"horizontal" \| "vertical" \| undefined` | Нет | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | `string \| undefined` | Нет | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | `string \| undefined` | Нет | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | `number \| undefined` | Нет | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | `boolean \| "false" \| "mixed" \| "true" \| undefined` | Нет | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | `Booleanish \| undefined` | Нет | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | `\| "additions"
            \| "additions removals"
            \| "additions text"
            \| "all"
            \| "removals"
            \| "removals additions"
            \| "removals text"
            \| "text"
            \| "text additions"
            \| "text removals"
            \| undefined` | Нет | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | `Booleanish \| undefined` | Нет | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | `string \| undefined` | Нет | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | `number \| undefined` | Нет | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | `number \| undefined` | Нет | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | `string \| undefined` | Нет | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | `number \| undefined` | Нет | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | `Booleanish \| undefined` | Нет | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | `number \| undefined` | Нет | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Нет | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | `number \| undefined` | Нет | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | `number \| undefined` | Нет | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | `number \| undefined` | Нет | Defines the current value for a range widget. |
| `aria-valuetext` | `string \| undefined` | Нет | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | `ReactNode \| undefined` | Нет |  |
| `dangerouslySetInnerHTML` | `{
            // Should be InnerHTML['innerHTML'].
            // But unfortunately we're mixing renderer-specific type declarations.
            __html: string \| TrustedHTML;
        } \| undefined` | Нет |  |
| `onCopy` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCopyCapture` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCut` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCutCapture` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onPaste` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onPasteCapture` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCompositionEnd` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionEndCapture` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionStart` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionStartCapture` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionUpdate` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionUpdateCapture` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onFocus` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onFocusCapture` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onBlur` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onBlurCapture` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onChange` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onChangeCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onBeforeInput` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onBeforeInputCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInput` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInputCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onReset` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onResetCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onSubmit` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onSubmitCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInvalid` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInvalidCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onLoad` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onError` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onErrorCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onKeyDown` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyDownCapture` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyPress` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyPressCapture` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyUp` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyUpCapture` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onAbort` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onAbortCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlay` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlayCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlayThrough` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlayThroughCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onDurationChange` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onDurationChangeCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEmptied` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEmptiedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEncrypted` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEncryptedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEnded` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEndedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedData` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedDataCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedMetadata` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedMetadataCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadStart` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadStartCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPause` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPauseCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlay` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlayCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlaying` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlayingCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onProgress` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onProgressCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onRateChange` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onRateChangeCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeeked` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeekedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeeking` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeekingCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onStalled` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onStalledCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSuspend` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSuspendCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onTimeUpdate` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onTimeUpdateCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onVolumeChange` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onVolumeChangeCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onWaiting` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onWaitingCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onAuxClick` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onAuxClickCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onClick` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onClickCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onContextMenu` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onContextMenuCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onDoubleClick` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onDoubleClickCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onDrag` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEnd` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEndCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEnter` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEnterCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragExit` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragExitCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragLeave` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragLeaveCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragOver` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragOverCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragStart` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragStartCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDrop` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDropCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onMouseDown` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseDownCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseEnter` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseLeave` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseMove` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseMoveCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOut` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOutCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOver` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOverCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseUp` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseUpCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onSelect` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSelectCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onTouchCancel` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchCancelCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchEnd` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchEndCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchMove` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchMoveCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchStart` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchStartCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onPointerDown` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerDownCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerMove` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerMoveCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerUp` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerUpCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerCancel` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerCancelCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerEnter` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerLeave` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOver` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOverCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOut` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOutCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onGotPointerCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onGotPointerCaptureCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onLostPointerCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onLostPointerCaptureCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onScroll` | `UIEventHandler<T> \| undefined` | Нет |  |
| `onScrollCapture` | `UIEventHandler<T> \| undefined` | Нет |  |
| `onWheel` | `WheelEventHandler<T> \| undefined` | Нет |  |
| `onWheelCapture` | `WheelEventHandler<T> \| undefined` | Нет |  |
| `onAnimationStart` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationStartCapture` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationEnd` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationEndCapture` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationIteration` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationIterationCapture` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onTransitionEnd` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionEndCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionCancel` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionCancelCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionRun` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionRunCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionStart` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionStartCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogHeader` (Identifier)

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogFooter` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `defaultChecked` | `boolean \| undefined` | Нет |  |
| `defaultValue` | `string \| number \| readonly string[] \| undefined` | Нет |  |
| `suppressContentEditableWarning` | `boolean \| undefined` | Нет |  |
| `suppressHydrationWarning` | `boolean \| undefined` | Нет |  |
| `accessKey` | `string \| undefined` | Нет |  |
| `autoCapitalize` | `"off" \| "none" \| "on" \| "sentences" \| "words" \| "characters" \| undefined \| (string & {})` | Нет |  |
| `autoFocus` | `boolean \| undefined` | Нет |  |
| `className` | `string \| undefined` | Нет |  |
| `contentEditable` | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` | Нет |  |
| `contextMenu` | `string \| undefined` | Нет |  |
| `dir` | `string \| undefined` | Нет |  |
| `draggable` | `Booleanish \| undefined` | Нет |  |
| `enterKeyHint` | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` | Нет |  |
| `hidden` | `boolean \| undefined` | Нет |  |
| `id` | `string \| undefined` | Нет |  |
| `lang` | `string \| undefined` | Нет |  |
| `nonce` | `string \| undefined` | Нет |  |
| `slot` | `string \| undefined` | Нет |  |
| `spellCheck` | `Booleanish \| undefined` | Нет |  |
| `style` | `CSSProperties \| undefined` | Нет |  |
| `tabIndex` | `number \| undefined` | Нет |  |
| `title` | `string \| undefined` | Нет |  |
| `translate` | `"yes" \| "no" \| undefined` | Нет |  |
| `radioGroup` | `string \| undefined` | Нет |  |
| `role` | `AriaRole \| undefined` | Нет |  |
| `about` | `string \| undefined` | Нет |  |
| `content` | `string \| undefined` | Нет |  |
| `datatype` | `string \| undefined` | Нет |  |
| `inlist` | `any` | Нет |  |
| `prefix` | `string \| undefined` | Нет |  |
| `property` | `string \| undefined` | Нет |  |
| `rel` | `string \| undefined` | Нет |  |
| `resource` | `string \| undefined` | Нет |  |
| `rev` | `string \| undefined` | Нет |  |
| `typeof` | `string \| undefined` | Нет |  |
| `vocab` | `string \| undefined` | Нет |  |
| `autoCorrect` | `string \| undefined` | Нет |  |
| `autoSave` | `string \| undefined` | Нет |  |
| `color` | `string \| undefined` | Нет |  |
| `itemProp` | `string \| undefined` | Нет |  |
| `itemScope` | `boolean \| undefined` | Нет |  |
| `itemType` | `string \| undefined` | Нет |  |
| `itemID` | `string \| undefined` | Нет |  |
| `itemRef` | `string \| undefined` | Нет |  |
| `results` | `number \| undefined` | Нет |  |
| `security` | `string \| undefined` | Нет |  |
| `unselectable` | `"on" \| "off" \| undefined` | Нет |  |
| `inputMode` | `"none" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| "search" \| undefined` | Нет | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | `string \| undefined` | Нет | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | `string \| undefined` | Нет |  |
| `part` | `string \| undefined` | Нет |  |
| `popover` | `"" \| "auto" \| "manual" \| undefined` | Нет |  |
| `popoverTargetAction` | `"toggle" \| "show" \| "hide" \| undefined` | Нет |  |
| `popoverTarget` | `string \| undefined` | Нет |  |
| `onToggle` | `ToggleEventHandler<T> \| undefined` | Нет |  |
| `onBeforeToggle` | `ToggleEventHandler<T> \| undefined` | Нет |  |
| `inert` | `boolean \| undefined` | Нет |  |
| `tw` | `string` | Нет | Specify styles using Tailwind CSS classes. This feature is currently experimental.
If `style` prop is also specified, styles generated with `tw` prop will be overridden.

Example:
- `tw='w-full h-full bg-blue-200'`
- `tw='text-9xl'`
- `tw='text-[80px]'` |
| `aria-activedescendant` | `string \| undefined` | Нет | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | `Booleanish \| undefined` | Нет | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | `"none" \| "inline" \| "list" \| "both" \| undefined` | Нет | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
presented if they are made. |
| `aria-braillelabel` | `string \| undefined` | Нет | Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. |
| `aria-brailleroledescription` | `string \| undefined` | Нет | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | `Booleanish \| undefined` | Нет |  |
| `aria-checked` | `boolean \| "false" \| "mixed" \| "true" \| undefined` | Нет | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | `number \| undefined` | Нет | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | `number \| undefined` | Нет | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | `string \| undefined` | Нет | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | `number \| undefined` | Нет | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | `string \| undefined` | Нет | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | `boolean \| "false" \| "true" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Нет | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | `string \| undefined` | Нет | Identifies the element (or elements) that describes the object. |
| `aria-description` | `string \| undefined` | Нет | Defines a string value that describes or annotates the current element. |
| `aria-details` | `string \| undefined` | Нет | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | `Booleanish \| undefined` | Нет | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | `"none" \| "copy" \| "execute" \| "link" \| "move" \| "popup" \| undefined` | Нет | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | `string \| undefined` | Нет | Identifies the element that provides an error message for the object. |
| `aria-expanded` | `Booleanish \| undefined` | Нет | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | `string \| undefined` | Нет | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | `Booleanish \| undefined` | Нет | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | `boolean \| "false" \| "true" \| "menu" \| "listbox" \| "tree" \| "grid" \| "dialog" \| undefined` | Нет | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | `Booleanish \| undefined` | Нет | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | `boolean \| "false" \| "true" \| "grammar" \| "spelling" \| undefined` | Нет | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | `string \| undefined` | Нет | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | `string \| undefined` | Нет | Defines a string value that labels the current element. |
| `aria-labelledby` | `string \| undefined` | Нет | Identifies the element (or elements) that labels the current element. |
| `aria-level` | `number \| undefined` | Нет | Defines the hierarchical level of an element within a structure. |
| `aria-live` | `"off" \| "assertive" \| "polite" \| undefined` | Нет | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | `Booleanish \| undefined` | Нет | Indicates whether an element is modal when displayed. |
| `aria-multiline` | `Booleanish \| undefined` | Нет | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | `Booleanish \| undefined` | Нет | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | `"horizontal" \| "vertical" \| undefined` | Нет | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | `string \| undefined` | Нет | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | `string \| undefined` | Нет | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | `number \| undefined` | Нет | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | `boolean \| "false" \| "mixed" \| "true" \| undefined` | Нет | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | `Booleanish \| undefined` | Нет | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | `\| "additions"
            \| "additions removals"
            \| "additions text"
            \| "all"
            \| "removals"
            \| "removals additions"
            \| "removals text"
            \| "text"
            \| "text additions"
            \| "text removals"
            \| undefined` | Нет | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | `Booleanish \| undefined` | Нет | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | `string \| undefined` | Нет | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | `number \| undefined` | Нет | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | `number \| undefined` | Нет | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | `string \| undefined` | Нет | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | `number \| undefined` | Нет | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | `Booleanish \| undefined` | Нет | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | `number \| undefined` | Нет | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Нет | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | `number \| undefined` | Нет | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | `number \| undefined` | Нет | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | `number \| undefined` | Нет | Defines the current value for a range widget. |
| `aria-valuetext` | `string \| undefined` | Нет | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `children` | `ReactNode \| undefined` | Нет |  |
| `dangerouslySetInnerHTML` | `{
            // Should be InnerHTML['innerHTML'].
            // But unfortunately we're mixing renderer-specific type declarations.
            __html: string \| TrustedHTML;
        } \| undefined` | Нет |  |
| `onCopy` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCopyCapture` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCut` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCutCapture` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onPaste` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onPasteCapture` | `ClipboardEventHandler<T> \| undefined` | Нет |  |
| `onCompositionEnd` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionEndCapture` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionStart` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionStartCapture` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionUpdate` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onCompositionUpdateCapture` | `CompositionEventHandler<T> \| undefined` | Нет |  |
| `onFocus` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onFocusCapture` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onBlur` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onBlurCapture` | `FocusEventHandler<T> \| undefined` | Нет |  |
| `onChange` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onChangeCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onBeforeInput` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onBeforeInputCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInput` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInputCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onReset` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onResetCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onSubmit` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onSubmitCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInvalid` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onInvalidCapture` | `FormEventHandler<T> \| undefined` | Нет |  |
| `onLoad` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onError` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onErrorCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onKeyDown` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyDownCapture` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyPress` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyPressCapture` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyUp` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onKeyUpCapture` | `KeyboardEventHandler<T> \| undefined` | Нет |  |
| `onAbort` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onAbortCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlay` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlayCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlayThrough` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onCanPlayThroughCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onDurationChange` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onDurationChangeCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEmptied` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEmptiedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEncrypted` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEncryptedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEnded` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onEndedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedData` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedDataCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedMetadata` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadedMetadataCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadStart` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onLoadStartCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPause` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPauseCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlay` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlayCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlaying` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onPlayingCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onProgress` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onProgressCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onRateChange` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onRateChangeCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeeked` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeekedCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeeking` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSeekingCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onStalled` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onStalledCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSuspend` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSuspendCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onTimeUpdate` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onTimeUpdateCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onVolumeChange` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onVolumeChangeCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onWaiting` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onWaitingCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onAuxClick` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onAuxClickCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onClick` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onClickCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onContextMenu` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onContextMenuCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onDoubleClick` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onDoubleClickCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onDrag` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEnd` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEndCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEnter` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragEnterCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragExit` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragExitCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragLeave` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragLeaveCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragOver` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragOverCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragStart` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDragStartCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDrop` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onDropCapture` | `DragEventHandler<T> \| undefined` | Нет |  |
| `onMouseDown` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseDownCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseEnter` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseLeave` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseMove` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseMoveCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOut` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOutCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOver` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseOverCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseUp` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onMouseUpCapture` | `MouseEventHandler<T> \| undefined` | Нет |  |
| `onSelect` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onSelectCapture` | `ReactEventHandler<T> \| undefined` | Нет |  |
| `onTouchCancel` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchCancelCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchEnd` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchEndCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchMove` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchMoveCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchStart` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onTouchStartCapture` | `TouchEventHandler<T> \| undefined` | Нет |  |
| `onPointerDown` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerDownCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerMove` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerMoveCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerUp` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerUpCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerCancel` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerCancelCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerEnter` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerLeave` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOver` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOverCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOut` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onPointerOutCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onGotPointerCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onGotPointerCaptureCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onLostPointerCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onLostPointerCaptureCapture` | `PointerEventHandler<T> \| undefined` | Нет |  |
| `onScroll` | `UIEventHandler<T> \| undefined` | Нет |  |
| `onScrollCapture` | `UIEventHandler<T> \| undefined` | Нет |  |
| `onWheel` | `WheelEventHandler<T> \| undefined` | Нет |  |
| `onWheelCapture` | `WheelEventHandler<T> \| undefined` | Нет |  |
| `onAnimationStart` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationStartCapture` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationEnd` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationEndCapture` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationIteration` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onAnimationIterationCapture` | `AnimationEventHandler<T> \| undefined` | Нет |  |
| `onTransitionEnd` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionEndCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionCancel` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionCancelCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionRun` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionRunCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionStart` | `TransitionEventHandler<T> \| undefined` | Нет |  |
| `onTransitionStartCapture` | `TransitionEventHandler<T> \| undefined` | Нет |  |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogFooter` (Identifier)

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogTitle` (Variable (CallExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogDescription` (Variable (CallExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogAction` (Variable (CallExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---
### `AlertDialogCancel` (Variable (CallExpression))

*Источник: `src/components\ui\alert-dialog.tsx`*

---

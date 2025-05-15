# Документация для `calendar.tsx`

*Путь к файлу: `src/components\ui\calendar.tsx`*

## Зависимости файла

```mermaid
flowchart TD
    calendar_tsx[calendar.tsx]
    react[react]
    calendar_tsx --> react
    lucide_react[lucide-react]
    calendar_tsx --> lucide_react
    react_day_picker[react-day-picker]
    calendar_tsx --> react_day_picker
    utils[@/lib/utils]
    calendar_tsx --> utils
    button[@/components/ui/button]
    calendar_tsx --> button
```

### `CalendarProps` (TypeAlias)

*Источник: `src/components\ui\calendar.tsx`*

---
### `Calendar` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `mode` | `undefined \| 'default'` | Нет |  |
| `className` | `string` | Нет | The CSS class to add to the container element. To change the name of the
class instead, use `classNames.root`. |
| `classNames` | `ClassNames` | Нет | Change the class names of the HTML elements.

Use this prop when you need to change the default class names — for example
when using CSS modules. |
| `modifiersClassNames` | `ModifiersClassNames` | Нет | Change the class name for the day matching the {@link modifiers}. |
| `style` | `CSSProperties` | Нет | Style to apply to the container element. |
| `styles` | `Styles` | Нет | Change the inline styles of the HTML elements. |
| `modifiersStyles` | `ModifiersStyles` | Нет | Change the inline style for the day matching the {@link modifiers}. |
| `id` | `string` | Нет | A unique id to replace the random generated id – used by DayPicker for
accessibility. |
| `defaultMonth` | `Date` | Нет | The initial month to show in the calendar. Use this prop to let DayPicker
control the current month. If you need to set the month programmatically,
use {@link month]] and [[onMonthChange}. |
| `month` | `Date` | Нет | The month displayed in the calendar.

As opposed to {@link DayPickerBase.defaultMonth}, use this prop with
{@link DayPickerBase.onMonthChange} to change the month programmatically. |
| `onMonthChange` | `MonthChangeEventHandler` | Нет | Event fired when the user navigates between months. |
| `numberOfMonths` | `number` | Нет | The number of displayed months. |
| `fromDate` | `Date` | Нет | The earliest day to start the month navigation. |
| `toDate` | `Date` | Нет | The latest day to end the month navigation. |
| `fromMonth` | `Date` | Нет | The earliest month to start the month navigation. |
| `toMonth` | `Date` | Нет | The latest month to end the month navigation. |
| `fromYear` | `number` | Нет | The earliest year to start the month navigation. |
| `toYear` | `number` | Нет | The latest year to end the month navigation. |
| `disableNavigation` | `boolean` | Нет | Disable the navigation between months. |
| `pagedNavigation` | `boolean` | Нет | Paginate the month navigation displaying the {@link numberOfMonths} at
time. |
| `reverseMonths` | `boolean` | Нет | Render the months in reversed order (when {@link numberOfMonths} is greater
than `1`) to display the most recent month first. |
| `captionLayout` | `CaptionLayout` | Нет | Change the layout of the caption:

- `buttons`: display prev/right buttons
- `dropdown`: display drop-downs to change the month and the year

**Note:** the `dropdown` layout is available only when `fromDate`,
`fromMonth` or`fromYear` and `toDate`, `toMonth` or `toYear` are set. |
| `fixedWeeks` | `boolean` | Нет | Display six weeks per months, regardless the month’s number of weeks.
To use this prop, {@link showOutsideDays} must be set. |
| `hideHead` | `boolean` | Нет | Hide the month’s head displaying the weekday names. |
| `showOutsideDays` | `boolean` | Нет | Show the outside days.  An outside day is a day falling in the next or the
previous month. |
| `showWeekNumber` | `boolean` | Нет | Show the week numbers column. Weeks are numbered according to the local
week index.

- to use ISO week numbering, use the {@link ISOWeek} prop.
- to change how the week numbers are displayed, use the {@link Formatters} prop. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | Нет | The index of the first day of the week (0 - Sunday). Overrides the locale's one. |
| `firstWeekContainsDate` | `1 \| 4` | Нет | The day of January, which is always in the first week of the year. Can be
either Monday (`1`) or Thursday (`4`). |
| `ISOWeek` | `boolean` | Нет | Use ISO week dates instead of the locale setting. Setting this prop will
ignore {@link weekStartsOn} and {@link firstWeekContainsDate}. |
| `components` | `CustomComponents` | Нет | Map of components used to create the layout. Look at the [components
source](https://github.com/gpbl/react-day-picker/tree/main/src/components)
to understand how internal components are built and provide your custom components. |
| `footer` | `ReactNode` | Нет | Content to add to the table footer element. |
| `initialFocus` | `boolean` | Нет | When a selection mode is set, DayPicker will focus the first selected day
(if set) or the today's date (if not disabled).

Use this prop when you need to focus DayPicker after a user actions, for
improved accessibility. |
| `disabled` | `Matcher \| Matcher[] \| undefined` | Нет | Apply the `disabled` modifier to the matching days. |
| `hidden` | `Matcher \| Matcher[] \| undefined` | Нет | Apply the `hidden` modifier to the matching days. Will hide them from the
calendar. |
| `selected` | `Matcher \| Matcher[] \| undefined` | Нет | Apply the `selected` modifier to the matching days. |
| `today` | `Date` | Нет | The today’s date. Default is the current date. This Date will get the
`today` modifier to style the day. |
| `modifiers` | `DayModifiers` | Нет | Add modifiers to the matching days. |
| `locale` | `Locale` | Нет | The date-fns locale object used to localize dates. |
| `labels` | `Partial<Labels>` | Нет | Labels creators to override the defaults. Use this prop to customize the
ARIA labels attributes. |
| `formatters` | `Partial<Formatters>` | Нет | A map of formatters. Use the formatters to override the default formatting
functions. |
| `dir` | `HTMLDivElement['dir']` | Нет | The text direction of the calendar. Use `ltr` for left-to-right (default)
or `rtl` for right-to-left. |
| `nonce` | `HTMLDivElement['nonce']` | Нет | A cryptographic nonce ("number used once") which can be used by Content
Security Policy for the inline `style` attributes. |
| `title` | `HTMLDivElement['title']` | Нет | Add a `title` attribute to the container element. |
| `lang` | `HTMLDivElement['lang']` | Нет | Add the language tag to the container element. |
| `onNextClick` | `MonthChangeEventHandler` | Нет | Event callback fired when the next month button is clicked. |
| `onPrevClick` | `MonthChangeEventHandler` | Нет | Event callback fired when the previous month button is clicked. |
| `onWeekNumberClick` | `WeekNumberClickEventHandler` | Нет | Event callback fired when the week number is clicked. Requires
`showWeekNumbers` set. |
| `onDayClick` | `DayClickEventHandler` | Нет | Event callback fired when the user clicks on a day. |
| `onDayFocus` | `DayFocusEventHandler` | Нет | Event callback fired when the user focuses on a day. |
| `onDayBlur` | `DayFocusEventHandler` | Нет | Event callback fired when the user blurs from a day. |
| `onDayMouseEnter` | `DayMouseEventHandler` | Нет | Event callback fired when the user hovers on a day. |
| `onDayMouseLeave` | `DayMouseEventHandler` | Нет | Event callback fired when the user hovers away from a day. |
| `onDayKeyDown` | `DayKeyboardEventHandler` | Нет | Event callback fired when the user presses a key on a day. |
| `onDayKeyUp` | `DayKeyboardEventHandler` | Нет | Event callback fired when the user presses a key on a day. |
| `onDayKeyPress` | `DayKeyboardEventHandler` | Нет | Event callback fired when the user presses a key on a day. |
| `onDayPointerEnter` | `DayPointerEventHandler` | Нет | Event callback fired when the pointer enters a day. |
| `onDayPointerLeave` | `DayPointerEventHandler` | Нет | Event callback fired when the pointer leaves a day. |
| `onDayTouchCancel` | `DayTouchEventHandler` | Нет | Event callback when a day touch event is canceled. |
| `onDayTouchEnd` | `DayTouchEventHandler` | Нет | Event callback when a day touch event ends. |
| `onDayTouchMove` | `DayTouchEventHandler` | Нет | Event callback when a day touch event moves. |
| `onDayTouchStart` | `DayTouchEventHandler` | Нет | Event callback when a day touch event starts. |

**Возвращает:** `React.JSX.Element`

*Источник: `src/components\ui\calendar.tsx`*

---
### `Calendar` (Identifier)

*Источник: `src/components\ui\calendar.tsx`*

---

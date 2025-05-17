# Инструкция для ИИ-агента по применению Material 3 в веб-приложении

## 1. Общее понимание Material 3

Material 3 - это новейшая версия дизайн-системы Google Material Design. Она представляет собой эволюцию Material Design 2 и включает в себя следующие ключевые улучшения:

- Персонализированная цветовая система с поддержкой динамических цветов
- Более гибкая типографика
- Обновленная система форм и скругления элементов
- Улучшенная система тем и токенов дизайна
- Обновленные компоненты с лучшей доступностью
- Новая концепция Material You для создания более персонализированных интерфейсов
- Информация для понимания на ресурсах https://m3.material.io/ , https://github.com/material-components/material-web , 

## 2. Первоначальная настройка проекта

### Добавление зависимостей

```bash
# Установка основной библиотеки Material Web
npm install @material/web

# Или для использования отдельных компонентов
npm install @material/web-button
npm install @material/web-checkbox
# и т.д. для других необходимых компонентов
```

### Настройка структуры проекта

```
project/
├── src/
│   ├── styles/
│   │   ├── tokens.css       # CSS-переменные для дизайн-токенов
│   │   ├── typography.css   # Настройки типографики
│   │   ├── colors.css       # Определение цветовой схемы
│   │   └── theme.css        # Основная тема приложения
│   ├── components/          # Компоненты приложения
│   └── index.html           # Главная страница
└── package.json
```

## 3. Настройка основных токенов дизайна

Создайте файл `tokens.css` со следующим содержимым:

```css
:root {
  /* Основные цвета темы */
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #EADDFF;
  --md-sys-color-on-primary-container: #21005E;

  --md-sys-color-secondary: #625B71;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #E8DEF8;
  --md-sys-color-on-secondary-container: #1E192B;

  --md-sys-color-tertiary: #7D5260;
  --md-sys-color-on-tertiary: #FFFFFF;
  --md-sys-color-tertiary-container: #FFD8E4;
  --md-sys-color-on-tertiary-container: #370B1E;

  --md-sys-color-error: #B3261E;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #F9DEDC;
  --md-sys-color-on-error-container: #410E0B;

  --md-sys-color-background: #FFFBFE;
  --md-sys-color-on-background: #1C1B1F;
  --md-sys-color-surface: #FFFBFE;
  --md-sys-color-on-surface: #1C1B1F;

  --md-sys-color-surface-variant: #E7E0EC;
  --md-sys-color-on-surface-variant: #49454F;
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #CAC4D0;
  
  /* Типографика */
  --md-ref-typeface-brand: 'Roboto';
  --md-ref-typeface-plain: 'Roboto';
  
  /* Скругление углов */
  --md-sys-shape-corner-small: 4px;
  --md-sys-shape-corner-medium: 8px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  
  /* Elevation (тени) */
  --md-sys-elevation-level1: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level2: 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level3: 0px 4px 8px 3px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level4: 0px 6px 10px 4px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level5: 0px 8px 12px 6px rgba(0, 0, 0, 0.15);
}
```

## 4. Настройка типографики

Создайте файл `typography.css`:

```css
:root {
  /* Размеры шрифтов */
  --md-sys-typescale-display-large-size: 57px;
  --md-sys-typescale-display-large-weight: 400;
  --md-sys-typescale-display-large-line-height: 64px;
  --md-sys-typescale-display-large-letter-spacing: -0.25px;
  
  --md-sys-typescale-display-medium-size: 45px;
  --md-sys-typescale-display-medium-weight: 400;
  --md-sys-typescale-display-medium-line-height: 52px;
  
  --md-sys-typescale-display-small-size: 36px;
  --md-sys-typescale-display-small-weight: 400;
  --md-sys-typescale-display-small-line-height: 44px;
  
  --md-sys-typescale-headline-large-size: 32px;
  --md-sys-typescale-headline-large-weight: 400;
  --md-sys-typescale-headline-large-line-height: 40px;
  
  --md-sys-typescale-headline-medium-size: 28px;
  --md-sys-typescale-headline-medium-weight: 400;
  --md-sys-typescale-headline-medium-line-height: 36px;
  
  --md-sys-typescale-headline-small-size: 24px;
  --md-sys-typescale-headline-small-weight: 400;
  --md-sys-typescale-headline-small-line-height: 32px;
  
  --md-sys-typescale-body-large-size: 16px;
  --md-sys-typescale-body-large-weight: 400;
  --md-sys-typescale-body-large-line-height: 24px;
  --md-sys-typescale-body-large-letter-spacing: 0.5px;
  
  --md-sys-typescale-body-medium-size: 14px;
  --md-sys-typescale-body-medium-weight: 400;
  --md-sys-typescale-body-medium-line-height: 20px;
  --md-sys-typescale-body-medium-letter-spacing: 0.25px;
  
  --md-sys-typescale-body-small-size: 12px;
  --md-sys-typescale-body-small-weight: 400;
  --md-sys-typescale-body-small-line-height: 16px;
  --md-sys-typescale-body-small-letter-spacing: 0.4px;
}

.md-typescale-display-large {
  font-family: var(--md-ref-typeface-brand);
  font-size: var(--md-sys-typescale-display-large-size);
  font-weight: var(--md-sys-typescale-display-large-weight);
  line-height: var(--md-sys-typescale-display-large-line-height);
  letter-spacing: var(--md-sys-typescale-display-large-letter-spacing);
}

.md-typescale-body-medium {
  font-family: var(--md-ref-typeface-plain);
  font-size: var(--md-sys-typescale-body-medium-size);
  font-weight: var(--md-sys-typescale-body-medium-weight);
  line-height: var(--md-sys-typescale-body-medium-line-height);
  letter-spacing: var(--md-sys-typescale-body-medium-letter-spacing);
}

/* И так далее для всех других типографических стилей */
```

## 5. Настройка темной темы

Добавьте поддержку темной темы в `theme.css`:

```css
@import 'tokens.css';
@import 'typography.css';
@import 'colors.css';

/* Переключение между светлой и темной темой */
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #D0BCFF;
    --md-sys-color-on-primary: #381E72;
    --md-sys-color-primary-container: #4F378B;
    --md-sys-color-on-primary-container: #EADDFF;

    --md-sys-color-secondary: #CCC2DC;
    --md-sys-color-on-secondary: #332D41;
    --md-sys-color-secondary-container: #4A4458;
    --md-sys-color-on-secondary-container: #E8DEF8;

    --md-sys-color-tertiary: #EFB8C8;
    --md-sys-color-on-tertiary: #492532;
    --md-sys-color-tertiary-container: #633B48;
    --md-sys-color-on-tertiary-container: #FFD8E4;

    --md-sys-color-error: #F2B8B5;
    --md-sys-color-on-error: #601410;
    --md-sys-color-error-container: #8C1D18;
    --md-sys-color-on-error-container: #F9DEDC;

    --md-sys-color-background: #1C1B1F;
    --md-sys-color-on-background: #E6E1E5;
    --md-sys-color-surface: #1C1B1F;
    --md-sys-color-on-surface: #E6E1E5;

    --md-sys-color-surface-variant: #49454F;
    --md-sys-color-on-surface-variant: #CAC4D0;
    --md-sys-color-outline: #938F99;
    --md-sys-color-outline-variant: #49454F;
  }
}
```

## 6. Импорт и использование компонентов Material 3

В основном файле JavaScript:

```javascript
// Импорт необходимых компонентов
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/icon/icon.js';

// Импорт стилей типографики
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

// Применение стилей типографики к документу
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

## 7. Создание основного HTML-шаблона

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Мое приложение с Material 3</title>
  
  <!-- Импорт шрифта Roboto -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Импорт стилей темы -->
  <link rel="stylesheet" href="styles/theme.css">
  
  <!-- Скрипт для настройки import map -->
  <script type="importmap">
    {
      "imports": {
        "@material/web/": "/node_modules/@material/web/"
      }
    }
  </script>
  
  <!-- Импорт основного скрипта -->
  <script type="module" src="main.js"></script>
</head>
<body>
  <header class="app-header">
    <h1 class="md-typescale-headline-large">Мое приложение с Material 3</h1>
  </header>
  
  <main class="app-content">
    <!-- Пример использования компонентов Material 3 -->
    <section class="form-section">
      <h2 class="md-typescale-headline-small">Форма ввода</h2>
      
      <md-filled-text-field 
        label="Имя" 
        required
        helper="Введите ваше имя">
      </md-filled-text-field>
      
      <md-outlined-text-field 
        label="Email" 
        type="email"
        required
        error-message="Пожалуйста, введите корректный email">
      </md-outlined-text-field>
      
      <div class="checkbox-container">
        <md-checkbox aria-label="Согласие с правилами"></md-checkbox>
        <label class="md-typescale-body-medium">Я согласен с правилами</label>
      </div>
      
      <div class="button-container">
        <md-text-button>Отмена</md-text-button>
        <md-filled-button>Отправить</md-filled-button>
      </div>
    </section>
  </main>
</body>
</html>
```

## 8. Пример стилизации компонентов

В файле CSS для вашего приложения:

```css
/* Настройка цвета кнопок */
md-filled-button {
  --md-filled-button-container-color: var(--md-sys-color-primary);
  --md-filled-button-label-text-color: var(--md-sys-color-on-primary);
}

/* Настройка текстовых полей */
md-filled-text-field {
  --md-filled-text-field-container-color: var(--md-sys-color-surface-variant);
  --md-filled-text-field-label-text-color: var(--md-sys-color-on-surface-variant);
}

/* Раскладка компонентов */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  border-radius: var(--md-sys-shape-corner-medium);
  background-color: var(--md-sys-color-surface);
  box-shadow: var(--md-sys-elevation-level2);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
```

## 9. Использование Material Theme Builder

Для более точной настройки цветовой схемы рекомендуется использовать Material Theme Builder:

1. Посетите [Material Theme Builder](https://m3.material.io/theme-builder)
2. Загрузите брендовую палитру или выберите основной цвет
3. Настройте параметры темы и сгенерируйте цветовую палитру
4. Экспортируйте токены дизайна в формате CSS
5. Интегрируйте полученные значения в файл `tokens.css`

## 10. Использование компонентов в приложении

### Кнопки

```html
<!-- Наполненная (filled) кнопка - для основных действий -->
<md-filled-button>Отправить</md-filled-button>

<!-- Контурная (outlined) кнопка - для второстепенных действий -->
<md-outlined-button>Редактировать</md-outlined-button>

<!-- Текстовая кнопка - для наименее приоритетных действий -->
<md-text-button>Отмена</md-text-button>

<!-- Кнопка с иконкой -->
<md-filled-button>
  <md-icon slot="icon">favorite</md-icon>
  Нравится
</md-filled-button>
```

### Поля ввода

```html
<!-- Наполненное текстовое поле -->
<md-filled-text-field 
  label="Заголовок" 
  value="Привет, мир!"
  helper="Введите заголовок статьи">
</md-filled-text-field>

<!-- Контурное текстовое поле -->
<md-outlined-text-field
  label="Поиск"
  type="search">
  <md-icon slot="trailing-icon">search</md-icon>
</md-outlined-text-field>
```

### Чекбоксы и переключатели

```html
<!-- Чекбокс -->
<md-checkbox checked></md-checkbox>

<!-- Радиокнопки -->
<md-radio name="group1" checked></md-radio>
<md-radio name="group1"></md-radio>

<!-- Переключатель -->
<md-switch selected></md-switch>
```

### Списки и карточки

```html
<!-- Список -->
<md-list>
  <md-list-item>
    <div slot="headline">Элемент 1</div>
    <div slot="supporting-text">Описание элемента 1</div>
  </md-list-item>
  <md-list-item>
    <div slot="headline">Элемент 2</div>
    <div slot="supporting-text">Описание элемента 2</div>
  </md-list-item>
</md-list>

<!-- Карточка -->
<md-elevated-card>
  <div class="card-content">
    <h2 class="md-typescale-headline-small">Заголовок карточки</h2>
    <p class="md-typescale-body-medium">Содержимое карточки с текстом и другими элементами.</p>
    <div class="card-actions">
      <md-text-button>Отмена</md-text-button>
      <md-filled-button>ОК</md-filled-button>
    </div>
  </div>
</md-elevated-card>
```

## 11. Адаптация для темной темы

```javascript
// Определение текущей темы и установка атрибута
function setThemeMode() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// Установка темы при загрузке страницы
setThemeMode();

// Отслеживание изменения темы системы
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeMode);

// Переключение темы вручную
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
}
```

## 12. Использование иконок Material

```html
<!-- Ссылка на Google Fonts для иконок Material Symbols -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<!-- Использование иконок в коде -->
<md-icon>favorite</md-icon>
<md-icon>home</md-icon>
<md-icon>settings</md-icon>
```

## 13. Реализация динамических цветов

Для поддержки динамических цветов на основе выбранного пользователем цвета:

```javascript
// Функция для генерации цветовой схемы из базового цвета
function generateColorScheme(baseColor) {
  // Здесь можно использовать библиотеки для генерации цветовой схемы 
  // или API Material Color Utilities
  
  // Примерная реализация с временными значениями
  document.documentElement.style.setProperty('--md-sys-color-primary', baseColor);
  
  // Вычисление остальных цветов на основе baseColor...
}

// Обработчик события выбора цвета пользователем
document.querySelector('#theme-color-picker').addEventListener('change', (e) => {
  generateColorScheme(e.target.value);
});
```

## 14. Практические рекомендации

1. **Консистентность**: Следуйте принципам материального дизайна во всем приложении
2. **Доступность**: Убедитесь, что цветовые контрасты соответствуют требованиям WCAG
3. **Поэтапное внедрение**: Начните с основных компонентов (кнопки, поля ввода) и постепенно добавляйте остальные
4. **Тестирование на разных устройствах**: Проверяйте отображение на мобильных и десктоп устройствах
5. **Вариативность размеров**: Используйте CSS-переменные для адаптации к различным размерам экранов

## 15. Для дальнейшего изучения

1. [Material Web](https://github.com/material-components/material-web)
2. [Material Design 3](https://m3.material.io/)
3. [Material Icons](https://fonts.google.com/icons)
4. [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)

## Заключение

Данная инструкция предоставляет основные рекомендации для применения Material 3 в веб-приложении с использованием библиотеки @material/web. При разработке интерфейса следует придерживаться принципов материального дизайна, обеспечивая единообразие и согласованность элементов интерфейса. Важно помнить о доступности и адаптивности приложения для различных устройств и условий использования.
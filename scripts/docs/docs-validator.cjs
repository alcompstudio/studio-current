const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

// --- Конфигурация ---
const ROOT_DIR = path.join(__dirname, '../../');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PROJECT_METADATA_PATH = path.join(ROOT_DIR, 'project-metadata.yaml');
const REPORT_FILE_PATH = path.join(DOCS_DIR, 'validation_report.md');

const PLACEHOLDER_KEYWORDS = ['TODO', 'FIXME', 'XXX', '(УТОЧНИТЬ)', '(ЗАПОЛНИТЬ)', '(ОПИСАНИЕ)', '(НЕОБХОДИМО']; // Регистронезависимый поиск

// --- Вспомогательные функции ---

/**
 * Рекурсивно обходит директории и находит все файлы с указанными расширениями.
 * @param {string} dir - Директория для сканирования.
 * @param {string[]} extensions - Массив расширений (например, ['.md', '.json']).
 * @returns {Promise<string[]>} - Массив путей к файлам.
 */
async function findFilesByExtension(dir, extensions) {
  let files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue;
        files = files.concat(await findFilesByExtension(fullPath, extensions));
      } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Если директория не существует (например, docs/api еще не создана), не прерываем работу
    if (error.code !== 'ENOENT') throw error;
  }
  return files;
}

/**
 * Проверяет существование файла или директории.
 * @param {string} filePath - Путь к файлу или директории.
 * @returns {Promise<boolean>} - true, если существует, иначе false.
 */
async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// --- Функции проверок ---

/**
 * Проверяет наличие плейсхолдеров в файле.
 */
function checkPlaceholders(filePath, content, issues) {
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    PLACEHOLDER_KEYWORDS.forEach(keyword => {
      if (line.toUpperCase().includes(keyword)) {
        issues.push({
          file: path.relative(ROOT_DIR, filePath),
          line: index + 1,
          type: 'Placeholder Found',
          message: `Найден маркер "${keyword.replace(/[()]/g, '')}": ${line.trim()}`
        });
      }
    });
  });
}

/**
 * Проверяет "мертвые" внутренние ссылки в Markdown файле.
 */
async function checkBrokenMarkdownLinks(filePath, content, issues) {
  const markdownLinksRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  const fileDir = path.dirname(filePath);

  while ((match = markdownLinksRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkTarget = match[2];

    if (linkTarget.startsWith('http://') || linkTarget.startsWith('https://') || linkTarget.startsWith('#') || linkTarget.startsWith('mailto:')) {
      continue; // Пропускаем внешние ссылки, якоря и email
    }

    const absoluteLinkPath = path.resolve(fileDir, linkTarget.split('#')[0]); // Убираем якорь для проверки файла

    if (!await pathExists(absoluteLinkPath)) {
      issues.push({
        file: path.relative(ROOT_DIR, filePath),
        type: 'Broken Link',
        message: `Ссылка "[${linkText}](${linkTarget})" указывает на несуществующий файл: ${path.relative(ROOT_DIR, absoluteLinkPath)}`
      });
    }
  }
}

/**
 * Проверяет project-metadata.yaml.
 */
async function checkProjectMetadata(filePath, projectMetadata, issues) {
    if (!projectMetadata.project) {
        issues.push({ file: path.relative(ROOT_DIR, filePath), type: 'Metadata Error', message: "Отсутствует обязательная секция 'project'."});
        return;
    }
    const 필수ПоляПроекта = ['name', 'version', 'description', 'documentation_root', 'ai_config_root'];
    for (const field of 필수ПоляПроекта) {
        if (!projectMetadata.project[field]) {
            issues.push({ file: path.relative(ROOT_DIR, filePath), type: 'Metadata Error', message: `В секции 'project' отсутствует обязательное поле '${field}'.`});
        }
    }

    if (projectMetadata.project.documentation_root && !await pathExists(path.join(ROOT_DIR, projectMetadata.project.documentation_root))) {
        issues.push({ file: path.relative(ROOT_DIR, filePath), type: 'Metadata Error', message: `Указанный 'project.documentation_root' (${projectMetadata.project.documentation_root}) не существует.`});
    }
    if (projectMetadata.project.ai_config_root && !await pathExists(path.join(ROOT_DIR, projectMetadata.project.ai_config_root))) {
        issues.push({ file: path.relative(ROOT_DIR, filePath), type: 'Metadata Error', message: `Указанный 'project.ai_config_root' (${projectMetadata.project.ai_config_root}) не существует.`});
    }

    if (projectMetadata.components && Array.isArray(projectMetadata.components)) {
        for (const comp of projectMetadata.components) {
            if (comp.path && !await pathExists(path.join(ROOT_DIR, comp.path))) {
                 issues.push({ file: path.relative(ROOT_DIR, filePath), type: 'Metadata Error', message: `Компонент '${comp.name}': указанный 'path' (${comp.path}) не существует.`});
            }
            if (comp.metadata && !await pathExists(path.join(ROOT_DIR, comp.metadata))) {
                 issues.push({ file: path.relative(ROOT_DIR, filePath), type: 'Metadata Error', message: `Компонент '${comp.name}': указанный 'metadata' (${comp.metadata}) не существует.`});
            }
            if (comp.docs && !await pathExists(path.join(ROOT_DIR, comp.docs))) {
                 issues.push({ file: path.relative(ROOT_DIR, filePath), type: 'Metadata Error', message: `Компонент '${comp.name}': указанный 'docs' (${comp.docs}) не существует.`});
            }
        }
    }
    // TODO: Добавить проверки для integrations
}


// --- Логика валидации ---
async function runValidation() {
  console.log('Запуск валидации документации...');
  const allIssues = [];

  // 1. Проверка Markdown файлов
  const markdownFiles = await findFilesByExtension(DOCS_DIR, ['.md']);
  console.log(`Найдено ${markdownFiles.length} Markdown файлов для проверки в ${DOCS_DIR}.`);
  for (const mdFile of markdownFiles) {
    try {
      const content = await fs.readFile(mdFile, 'utf-8');
      checkPlaceholders(mdFile, content, allIssues);
      await checkBrokenMarkdownLinks(mdFile, content, allIssues);
    } catch (error) {
      if (error.code !== 'ENOENT') { // Игнорируем, если файл был удален между findFilesByExtension и readFile
        allIssues.push({ file: path.relative(ROOT_DIR, mdFile), type: 'File Error', message: `Ошибка чтения файла: ${error.message}`});
      }
    }
  }

  // 2. Проверка project-metadata.yaml
  if (await pathExists(PROJECT_METADATA_PATH)) {
    console.log(`Проверка файла: ${PROJECT_METADATA_PATH}`);
    try {
      const metadataContent = await fs.readFile(PROJECT_METADATA_PATH, 'utf-8');
      const projectMetadata = yaml.load(metadataContent);
      await checkProjectMetadata(PROJECT_METADATA_PATH, projectMetadata, allIssues);
    } catch (error) {
      allIssues.push({ file: path.relative(ROOT_DIR, PROJECT_METADATA_PATH), type: 'File Error', message: `Ошибка чтения или парсинга YAML: ${error.message}`});
    }
  } else {
    allIssues.push({ file: path.relative(ROOT_DIR, PROJECT_METADATA_PATH), type: 'File Error', message: 'Файл project-metadata.yaml не найден.'});
  }

  // TODO: Проверка *.metadata.json файлов (например, соответствие схеме, актуальность дат)
  // TODO: Проверка соответствия кода и документации (например, все ли компоненты из src/components имеют документацию)
  // TODO: Проверка ADR файлов (например, корректность статусов, наличие обязательных секций)

  // 3. Формирование отчета и возврат результата
  let reportContent = `# Отчет о валидации документации (${new Date().toISOString()})\n\n`;
  if (allIssues.length > 0) {
    console.warn(`\nОбнаружено ${allIssues.length} проблем в документации:`);
    reportContent += `Всего найдено проблем: ${allIssues.length}\n\n`;
    allIssues.forEach(issue => {
      const issueMsg = `- [${issue.type}] в файле \`${issue.file}\`${issue.line ? ` (строка ${issue.line})` : ''}: ${issue.message}`;
      console.warn(issueMsg);
      reportContent += `## ${issue.type} в \`${issue.file}\`\n`;
      if(issue.line) reportContent += `* Строка: ${issue.line}\n`;
      reportContent += `* Сообщение: ${issue.message}\n\n`;
    });
  } else {
    reportContent += "Проверка документации завершена. Проблем не обнаружено.\n";
    console.log('\nПроверка документации завершена. Проблем не обнаружено.');
  }

  await fs.writeFile(REPORT_FILE_PATH, reportContent);
  console.log(`Отчет о валидации сохранен в: ${path.relative(ROOT_DIR, REPORT_FILE_PATH)}`);
  
  return {
    success: allIssues.length === 0,
    issues: allIssues,
    reportPath: REPORT_FILE_PATH
  };
}

// --- Основная функция для CLI ---
async function main() {
  try {
    const validationResult = await runValidation();
    if (!validationResult.success) {
      process.exitCode = 1; // Выход с кодом ошибки, если есть проблемы
    }
  } catch (error) {
    console.error('Критическая ошибка в валидаторе документации (CLI):', error);
    process.exit(1);
  }
}

// Если запускается напрямую из CLI
if (require.main === module) {
  main();
}

module.exports = {
  runValidation,
  // Для documentation-updater.js может быть удобнее иметь функцию без параметров,
  // которая просто запускает валидацию.
  validateAllDocumentation: () => runValidation()
};

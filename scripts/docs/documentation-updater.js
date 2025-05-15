const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
// Импорты из checkpoint-detector здесь больше не нужны.

const LAST_UPDATE_TIMESTAMP_FILE = path.join(__dirname, '../../.ai/.last_doc_update_timestamp'); // Перенесено сюда

/**
 * Обновляет время последнего обновления документации.
 */
async function updateLastDocumentationTimestamp() { // Перенесено сюда
  try {
    await fsPromises.writeFile(LAST_UPDATE_TIMESTAMP_FILE, new Date().toISOString());
    console.log(`Время последнего обновления документации обновлено в ${LAST_UPDATE_TIMESTAMP_FILE}`);
  } catch (error) {
    console.error(`Ошибка при обновлении времени последнего обновления документации:`, error);
  }
}

// Предполагаем, что другие скрипты будут доработаны для экспорта функций
// Заглушки для импорта, пока другие скрипты не обновлены:
const generateProgressLog = async () => { console.log('Функция generateProgressLog (из git-progress-generator) еще не реализована для импорта.'); /* TODO: Импортировать и вызвать реальную функцию */ };
const extractCodeStructure = async (type) => { console.log(`Функция extractCodeStructure (из code-structure-extractor) для ${type} еще не реализована для импорта.`); return []; /* TODO: Импортировать и вызвать реальную функцию */};
const validateDocumentation = async () => { console.log('Функция validateDocumentation (из docs-validator) еще не реализована для импорта.'); return []; /* TODO: Импортировать и вызвать реальную функцию */};
const createNewAdr = async (reason) => { // Заглушка для suggest-adr
    const templatePath = path.join(__dirname, '../../docs/decisions/YYYYMMDD-template-adr.md');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newAdrFileName = `${date}-suggested-adr-for-${reason.toLowerCase().replace(/\s+/g, '-')}.md`;
    const newAdrFilePath = path.join(__dirname, '../../docs/decisions', newAdrFileName);
    try {
        const templateContent = await fsPromises.readFile(templatePath, 'utf8');
        const newAdrContent = templateContent
            .replace(/\[Название архитектурного решения\]/g, `[Предложено ADR: ${reason}]`)
            .replace(/YYYY-MM-DD/g, new Date().toISOString().slice(0, 10))
            .replace(/\(Описание проблемы.*\)/g, `(Автоматически предложено на основе события: ${reason})`);
        await fsPromises.writeFile(newAdrFilePath, newAdrContent);
        console.log(`Создан шаблон ADR: ${newAdrFilePath}`);
        return newAdrFilePath;
    } catch (error) {
        console.error(`Ошибка при создании шаблона ADR:`, error);
        throw error;
    }
};


// --- Интерфейс действий для обновления документации ---
const documentationActions = {
  'update-progress-log': async () => {
    console.log('Обновление журнала прогресса...');
    const gitProgressGenerator = require('./git-progress-generator'); 
    if (typeof gitProgressGenerator.generateCurrentProgressReport === 'function') { 
        await gitProgressGenerator.generateCurrentProgressReport();
    } else if (typeof gitProgressGenerator.generateReport === 'function') { 
        // В качестве запасного варианта, если generateCurrentProgressReport нет,
        // можно вызвать generateReport с периодом по умолчанию.
        console.log('Вызов generateReport с периодом по умолчанию...');
        await gitProgressGenerator.generateReport('1.week.ago'); // или COMMITS_SINCE_DEFAULT, если он экспортируется
    } else {
        console.warn('Не удалось найти подходящую функцию (generateCurrentProgressReport или generateReport) в git-progress-generator.js');
    }
  },
  
  'update-component-metadata': async () => {
    console.log('Обновление метаданных компонентов и их документации...');
    const codeExtractor = require('./code-structure-extractor');
    if (typeof codeExtractor.extractAll === 'function') { 
        await codeExtractor.extractAll();
    } else if (typeof codeExtractor.extractAndGenerateDocumentation === 'function') { // Исправлено на актуальное имя
        await codeExtractor.extractAndGenerateDocumentation();
    } else {
         console.warn('Не удалось найти подходящую функцию для обновления метаданных в code-structure-extractor.js');
    }
  },
  
  'update-architecture-docs': async () => {
    console.log('Обновление документации по архитектуре (требует ручного вмешательства или умного анализа)...');
  },
  
  'update-api-docs': async () => {
    console.log('Обновление документации API (требует специализированного инструмента или анализа)...');
  },
  
  'create-component-docs': async () => {
    console.log('Создание документации для новых компонентов (обычно часть update-component-metadata)...');
    await documentationActions['update-component-metadata']();
  },
  
  'validate-docs': async () => {
    console.log('Проверка целостности документации...');
    const validator = require('./docs-validator');
    if (typeof validator.validateAllDocumentation === 'function') { 
        return await validator.validateAllDocumentation();
    } else if (typeof validator.runValidation === 'function') { 
        // В качестве запасного варианта, если validateAllDocumentation нет
        console.log('Вызов runValidation из docs-validator.js...');
        return await validator.runValidation();
    } else {
        console.warn('Не удалось найти подходящую функцию (validateAllDocumentation или runValidation) в docs-validator.js');
        return { success: false, issues: [{ type: 'Internal Error', message: 'Validator function not found' }], reportPath: null };
    }
  },
  
  'suggest-adr': async (reason = "Обнаружено архитектурное изменение") => {
    console.log(`Подготовка шаблона ADR для: ${reason}...`);
    await createNewAdr(reason);
  },
  
  'full-documentation-update': async () => {
    console.log('Выполнение полного обновления документации...');
    await documentationActions['update-progress-log']();
    await documentationActions['update-component-metadata']();
    await documentationActions['validate-docs']();
  }
};

// --- Функции для взаимодействия с ИИ-агентом ---

const PENDING_UPDATES_FILE_PATH = path.join(__dirname, '../../.ai/pending-documentation-updates.md');

function createProposalForUpdate(checkpoints) {
  let proposal = `# Предложение по обновлению документации\n\n`;
  proposal += `Обнаружены следующие чекпоинты, требующие обновления документации:\n\n`;
  
  checkpoints.forEach(checkpoint => {
    proposal += `## ${checkpoint.name}\n`;
    proposal += `Причина: ${checkpoint.reason}\n\n`;
    proposal += `Предлагаемые действия:\n`;
    checkpoint.actions.forEach(action => {
      proposal += `- \`${action}\`\n`; 
    });
    proposal += `\n`;
  });
  
  proposal += `**Хотите выполнить эти обновления документации сейчас?**\n`;
  proposal += `(Ответьте "да" или перечислите действия, которые нужно выполнить, например: "да, выполнить update-progress-log, validate-docs")\n`;
  
  return proposal;
}

async function saveProposalForAgent(proposal, filePath) { // filePath добавлен как параметр
  try {
    await fsPromises.writeFile(filePath, proposal); 
    console.log(`Предложение по обновлению сохранено в: ${filePath}`);
  } catch (error) {
    console.error(`Ошибка при сохранении предложения для агента в ${filePath}:`, error);
  }
}

// --- Основные функции скрипта ---

/**
 * Обрабатывает сработавшие чекпоинты и генерирует файл с предложениями.
 * @param {Array<object>} triggeredCheckpoints - Массив сработавших чекпоинтов.
 * @returns {Promise<object>} - Результат с информацией о предложении.
 */
async function processCheckpointsAndGenerateProposal(triggeredCheckpoints) {
  if (!triggeredCheckpoints || triggeredCheckpoints.length === 0) {
    console.log("Нет сработавших чекпоинтов для обработки.");
    return { shouldUpdate: false, proposalPath: null };
  }
  
  console.log(`Обработка ${triggeredCheckpoints.length} сработавших чекпоинтов...`);
  const proposal = createProposalForUpdate(triggeredCheckpoints);
  await saveProposalForAgent(proposal, PENDING_UPDATES_FILE_PATH); 
  console.log("Предложение по обновлению документации создано.");
  return {
    shouldUpdate: true, 
    checkpoints: triggeredCheckpoints, 
    proposalPath: path.relative(path.join(__dirname, '../../'), PENDING_UPDATES_FILE_PATH) 
  };
}

async function executeDocumentationUpdates(approvedActions) {
  console.log(`Выполнение одобренных действий: ${approvedActions.join(', ')}...`);
  const results = [];
  let allSuccessful = true;

  for (const action of approvedActions) {
    if (documentationActions[action]) {
      try {
        console.log(`--- Выполнение действия: ${action} ---`);
        const result = await documentationActions[action]();
        results.push({
          action,
          success: true,
          result: result || "Выполнено успешно"
        });
        console.log(`--- Действие ${action} выполнено успешно ---`);
      } catch (error) {
        allSuccessful = false;
        results.push({
          action,
          success: false,
          error: error.message
        });
        console.error(`--- Ошибка при выполнении действия ${action}: ${error.message} ---`);
      }
    } else {
      allSuccessful = false;
      results.push({
        action,
        success: false,
        error: "Неизвестное действие"
      });
      console.warn(`--- Неизвестное действие: ${action} ---`);
    }
  }
  
  if (allSuccessful) {
    await updateLastDocumentationTimestamp(); 
  }
  console.log("Выполнение действий завершено.");
  return results;
}

// Если скрипт запускается напрямую
if (require.main === module) {
  (async () => {
    console.log("[Тестирование выполнения действий documentation-updater]");

    // Имитируем одобренные действия для теста
    const approvedActionsToTest = [
      "update-progress-log",
      "update-component-metadata",
      "validate-docs"
    ];
    
    if (approvedActionsToTest.length > 0) {
        console.log(`\nИмитация выполнения одобренных действий: ${approvedActionsToTest.join(', ')}`);
        // Перед выполнением, убедимся, что файл .last_doc_update_timestamp существует,
        // чтобы executeDocumentationUpdates мог его обновить.
        // Если его нет, создадим с датой по умолчанию.
        try {
            await fsPromises.access(LAST_UPDATE_TIMESTAMP_FILE);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`Файл ${LAST_UPDATE_TIMESTAMP_FILE} не найден, создаем с датой по умолчанию.`);
                await fsPromises.writeFile(LAST_UPDATE_TIMESTAMP_FILE, new Date(0).toISOString());
            }
        }
        
        const executionResults = await executeDocumentationUpdates(approvedActionsToTest);
        console.log("\nРезультаты выполнения:");
        executionResults.forEach(res => {
          console.log(`- Действие: ${res.action}, Успех: ${res.success}${res.error ? `, Ошибка: ${res.error}` : ''}`);
        });

        // Проверим, обновился ли timestamp
        try {
            const updatedTimestamp = await fsPromises.readFile(LAST_UPDATE_TIMESTAMP_FILE, 'utf8');
            console.log(`\nПроверка ${LAST_UPDATE_TIMESTAMP_FILE}: ${updatedTimestamp}`);
        } catch (error) {
            console.error(`Не удалось прочитать ${LAST_UPDATE_TIMESTAMP_FILE} после выполнения.`);
        }

    } else {
        console.log("\nНет действий для тестового выполнения.");
    }
  })().catch(error => {
    console.error("Критическая ошибка в documentation-updater (тестовый запуск):", error);
    process.exit(1);
  });
}

module.exports = {
  processCheckpointsAndGenerateProposal, 
  executeDocumentationUpdates,
  documentationActions 
};

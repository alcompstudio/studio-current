const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const { execSync, exec } = require('child_process');

// --- Конфигурация ---
const CONFIG_FILE_PATH = path.join(__dirname, '../../.ai/documentation-checkpoints.yaml');
const DOCS_PROGRESS_DIR = path.join(__dirname, '../../docs/progress');
// LAST_UPDATE_TIMESTAMP_FILE ПЕРЕНЕСЕНО В documentation-updater.js

// --- Загрузка конфигурации ---
let checkpointsConfig;
try {
  checkpointsConfig = yaml.load(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'));
} catch (error) {
  console.error(`Ошибка загрузки конфигурационного файла чекпоинтов (${CONFIG_FILE_PATH}):`, error);
  // Завершаем работу или используем конфигурацию по умолчанию, если это критично
  process.exit(1); 
}

// --- Вспомогательные функции ---

/**
 * Получает время последнего обновления документации.
 * Пока что это заглушка. Может читать из файла или последнего коммита в docs/progress.
 */
async function getLastDocumentationUpdateTime() {
  // Используем путь к файлу из documentation-updater.js или переопределяем здесь, если нужно
  // Но так как эта функция теперь только читает, а обновляет documentation-updater,
  // то путь должен быть согласован. Пока оставим так, но это кандидат на рефакторинг,
  // чтобы checkpoint-detector не знал о файле напрямую, а получал дату.
  // Однако, для простоты, пока оставим чтение здесь.
  const timestampFilePath = path.join(__dirname, '../../.ai/.last_doc_update_timestamp'); // Используем тот же путь
  try {
    const timestamp = await fsPromises.readFile(timestampFilePath, 'utf8');
    return new Date(timestamp).toISOString();
  } catch (error) {
    console.warn(`Файл ${timestampFilePath} не найден или ошибка чтения. Используется дата по умолчанию.`);
    return new Date(0).toISOString(); // Начало эпохи Unix
  }
}

// updateLastDocumentationTimestamp ПЕРЕНЕСЕНА В documentation-updater.js


/**
 * Выполняет git команду асинхронно.
 * @param {string} command
 * @returns {Promise<string>}
 */
function runGitCommandAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing git command: ${command}\nStderr: ${stderr}`);
        return reject(error);
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * Анализирует изменения в коде на основе git diff.
 * @param {string} sinceCommitOrDate - Хеш коммита или дата, с которой анализировать изменения.
 * @returns {Promise<string[]>} - Массив строк, описывающих типы изменений (например, "new_component_added").
 */
async function analyzeCodeChanges(sinceCommitOrDate) {
  if (typeof sinceCommitOrDate !== 'string' || !sinceCommitOrDate) {
    console.warn(`[WARN] analyzeCodeChanges: sinceCommitOrDate is invalid or undefined: '${sinceCommitOrDate}'. Returning empty events.`);
    return [];
  }
  const events = new Set();
  try {
    // Получаем измененные файлы и их статусы (A, M, D) с указанного коммита/даты
    // Для последнего коммита: git diff HEAD^ HEAD --name-status
    // Для диапазона: git diff <sinceCommitOrDate> HEAD --name-status
    // Если sinceCommitOrDate - это дата, git diff может не сработать так, как ожидается.
    // Лучше использовать git log --name-status --pretty="format:" --after="<date>"
    // или git log --name-status --pretty="format:" <sinceCommitOrDate>..HEAD

    let diffOutput;
    // Определяем, является ли sinceCommitOrDate датой или хешем коммита
    // Простая проверка: если содержит '-', вероятно дата. Не очень надежно.
    // Более надежно - пытаться использовать как дату с --after, если не похоже на хеш.
    const isLikelyDate = sinceCommitOrDate.includes('-') && sinceCommitOrDate.includes(':'); // YYYY-MM-DDTHH:MM:SSZ

    if (isLikelyDate) {
        diffOutput = await runGitCommandAsync(`git log --name-status --pretty="format:" --after="${sinceCommitOrDate}"`);
    } else { // Предполагаем, что это хеш коммита или тег
        diffOutput = await runGitCommandAsync(`git log --name-status --pretty="format:" ${sinceCommitOrDate}..HEAD`);
    }

    const changedFiles = diffOutput.split('\n').filter(line => line.trim() !== '');

    for (const line of changedFiles) {
      const parts = line.split('\t'); // Статус \t Файл (иногда \t СтарыйФайл для переименований)
      if (parts.length < 2) continue;

      const status = parts[0].trim();
      const filePath = parts[1].trim();

      // Новый компонент
      if (status.startsWith('A') && (filePath.startsWith('src/components/') || filePath.startsWith('src/app/(app)/')) && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
        events.add('new_component_added');
      }
      // Изменение компонента
      if (status.startsWith('M') && (filePath.startsWith('src/components/') || filePath.startsWith('src/app/(app)/')) && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
        events.add('component_significantly_modified'); // Пока любое изменение считаем значительным
      }
      // Изменение API (упрощенно)
      if (filePath.startsWith('src/app/api/') && (status.startsWith('A') || status.startsWith('M'))) {
        events.add('api_signature_changed'); // Упрощенно, любое изменение в API триггерит
      }
      // Изменение структуры проекта
      if ((filePath === 'package.json' || filePath === 'tsconfig.json') && status.startsWith('M')) {
        events.add('project_structure_changed');
      }
      // TODO: Добавить 'dependency_graph_changed' - это сложнее, требует анализа импортов в измененных файлах
    }
  } catch (error) {
    console.error("Ошибка при анализе изменений кода:", error);
  }
  
  const resultEvents = Array.from(events);
  if (resultEvents.length > 0) {
      console.log("Обнаруженные события изменения кода:", resultEvents);
  }
  return resultEvents;
}


// --- Функции проверки чекпоинтов ---

async function checkGitBasedCheckpoints(lastDocUpdateTime) { // Принимаем lastDocUpdateTime как параметр
  const triggeredCheckpoints = [];
  if (!checkpointsConfig || !checkpointsConfig.checkpoints || !checkpointsConfig.checkpoints['git-based']) {
    console.warn("Секция 'git-based' в конфигурации чекпоинтов не найдена или пуста.");
    return triggeredCheckpoints;
  }

  for (const checkpoint of checkpointsConfig.checkpoints['git-based']) {
    try {
      if (checkpoint.type === 'time-based' && checkpoint.trigger) {
        // Логика для time-based чекпоинтов
        // Эта логика должна быть более надежной, например, проверять, что с момента lastDocUpdateTime
        // или с момента последнего срабатывания этого конкретного чекпоинта прошла неделя, и сегодня пятница.
        // Для простоты, пока оставим заглушку.
        const today = new Date();
        const lastUpdateDate = new Date(lastDocUpdateTime);
        const diffTime = Math.abs(today - lastUpdateDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (checkpoint.trigger.frequency === "weekly" && today.getDay() === 5 /* Пятница */) {
            // Проверяем, что с последнего обновления прошло достаточно времени, чтобы не триггерить каждую пятницу подряд, если обновления были недавно
            // Или, если есть файл .ai/.last_weekly_checkpoint_ts, сравнивать с ним
            // Пока упрощенно: если прошло больше 6 дней и сегодня пятница
            if (diffDays > 6) {
                 triggeredCheckpoints.push({
                   name: checkpoint.name,
                   reason: `Еженедельный триггер (${checkpoint.trigger.day}), прошло ${diffDays} дней с последнего обновления документации.`,
                   actions: checkpoint.actions
                 });
            } else {
                console.log(`Time-based чекпоинт "${checkpoint.name}": сегодня пятница, но с последнего обновления прошло ${diffDays} дней (меньше 7).`);
            }
        }
      } else if (checkpoint.type === 'commit-based' && checkpoint.trigger) {
        let patterns = '';
        if (checkpoint.trigger.significant_files_pattern && Array.isArray(checkpoint.trigger.significant_files_pattern)) {
            patterns = checkpoint.trigger.significant_files_pattern.map(p => `"${p}"`).join(' '); // Экранируем пути с пробелами, если есть
        }
        const commitCountCmd = `git rev-list --count --after="${lastDocUpdateTime}" HEAD -- ${patterns}`;
        try {
            const commitCountOutput = await runGitCommandAsync(commitCountCmd);
            const commitCount = parseInt(commitCountOutput, 10);

            if (commitCount >= checkpoint.trigger.commit_count) {
              triggeredCheckpoints.push({
                name: checkpoint.name,
                reason: `Накоплено ${commitCount} коммитов (требуется ${checkpoint.trigger.commit_count}) с ${lastDocUpdateTime} в файлах, соответствующих: ${patterns || 'любые файлы'}.`,
                actions: checkpoint.actions
              });
            }
        } catch (error) {
            // Если git rev-list возвращает ошибку (например, из-за некорректных паттернов или если нет коммитов после даты),
            // это не должно прерывать весь скрипт.
            console.warn(`Предупреждение при подсчете коммитов для чекпоинта "${checkpoint.name}": ${error.message}. Возможно, нет коммитов, удовлетворяющих условиям.`);
        }
      } else if (checkpoint.type === 'file-pattern-based' && checkpoint.trigger && checkpoint.trigger.patterns) {
        let patterns = '';
        if (Array.isArray(checkpoint.trigger.patterns)) {
            patterns = checkpoint.trigger.patterns.map(p => `"${p}"`).join(' ');
        }
        const changedFilesCmd = `git log --name-only --pretty="format:" --after="${lastDocUpdateTime}" -- ${patterns}`;
        const changedFilesOutput = await runGitCommandAsync(changedFilesCmd);
        const changedFilesInPattern = changedFilesOutput.split('\n').filter(file => file.trim() !== '');

        if (changedFilesInPattern.length > 0) {
          triggeredCheckpoints.push({
            name: checkpoint.name,
            reason: `Обнаружены изменения в файлах, соответствующих паттернам: ${patterns} (изменено ${changedFilesInPattern.length} файлов).`,
            actions: checkpoint.actions
          });
        }
      } else if (checkpoint.type === 'file-pattern-based' && checkpoint.trigger && checkpoint.trigger.patterns) {
        // Проверка изменений определенных типов файлов с последнего обновления
        // git log --name-only --pretty=format:"" --after="YYYY-MM-DDTHH:mm:ssZ" src/app/api/**/*
        const changedFilesCmd = `git log --name-only --pretty=format:"" --after="${lastDocUpdateTime}" ${checkpoint.trigger.patterns.join(' ')}`;
        const changedFilesOutput = await runGitCommandAsync(changedFilesCmd);
        const changedFilesInPattern = changedFilesOutput.split('\n').filter(file => file.trim() !== '');

        if (changedFilesInPattern.length > 0) {
          triggeredCheckpoints.push({
            name: checkpoint.name,
            reason: `Обнаружены изменения в файлах, соответствующих паттернам: ${checkpoint.trigger.patterns.join(', ')} (изменено ${changedFilesInPattern.length} файлов).`,
            actions: checkpoint.actions
          });
        }
      }
    } catch (error) {
        console.error(`Ошибка при проверке git-based чекпоинта "${checkpoint.name}":`, error);
    }
  }
  return triggeredCheckpoints;
}

async function checkCodeBasedCheckpoints(lastDocUpdateTime) { // Добавляем lastDocUpdateTime как параметр
  const triggeredCheckpoints = [];
   if (!checkpointsConfig || !checkpointsConfig.checkpoints || !checkpointsConfig.checkpoints['code-based']) {
    console.warn("Секция 'code-based' в конфигурации чекпоинтов не найдена.");
    return triggeredCheckpoints;
  }

  const codeChangeEvents = await analyzeCodeChanges(lastDocUpdateTime); // Передаем lastDocUpdateTime

  for (const checkpoint of checkpointsConfig.checkpoints['code-based']) {
    try {
      if (checkpoint.type === 'code-structure-change' && checkpoint.trigger && checkpoint.trigger.event) {
        // В реальной системе codeChangeEvents будет содержать события типа 'new_component_added'
        if (codeChangeEvents.includes(checkpoint.trigger.event)) {
          triggeredCheckpoints.push({
            name: checkpoint.name,
            reason: `Обнаружено событие изменения структуры кода: "${checkpoint.trigger.event}"`,
            actions: checkpoint.actions
          });
        }
      }
    } catch (error)
        {
        console.error(`Ошибка при проверке code-based чекпоинта "${checkpoint.name}":`, error);
    }
  }
  return triggeredCheckpoints;
}

// --- Основная функция ---
async function detectTriggeredCheckpoints() {
  console.log("Обнаружение пройденных чекпоинтов...");
  const lastDocUpdateTime = await getLastDocumentationUpdateTime();
  console.log(`[DEBUG] detectTriggeredCheckpoints - lastDocUpdateTime: '${lastDocUpdateTime}', type: ${typeof lastDocUpdateTime}`); // Добавлен лог
  const gitBasedResults = await checkGitBasedCheckpoints(lastDocUpdateTime);
  const codeBasedResults = await checkCodeBasedCheckpoints(lastDocUpdateTime);
  
  const allTriggered = [...gitBasedResults, ...codeBasedResults];
  if (allTriggered.length > 0) {
    console.log(`Обнаружено ${allTriggered.length} сработавших чекпоинтов.`);
  } else {
    console.log("Сработавших чекпоинтов не обнаружено.");
  }
  return allTriggered;
}

// Если скрипт запускается напрямую (например, для тестирования или из CI)
if (require.main === module) {
  detectTriggeredCheckpoints()
    .then(triggered => {
      if (triggered.length > 0) {
        console.log(`\nОбнаружено ${triggered.length} сработавших чекпоинтов документации.`);
        console.log("Для обновления документации запустите: node scripts/docs/documentation-updater.cjs");
      } else {
        console.log("\nСработавших чекпоинтов не обнаружено.");
      }
    })
    .catch(error => {
      console.error("Ошибка в процессе обнаружения чекпоинтов:", error);
      process.exit(1);
    });
}

module.exports = {
  detectTriggeredCheckpoints
  // updateLastDocumentationTimestamp БОЛЬШЕ НЕ ЭКСПОРТИРУЕТСЯ ОТСЮДА
};

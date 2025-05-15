const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');

// --- Конфигурация ---
const PROGRESS_DIR = path.join(__dirname, '../../docs/progress');
const COMMITS_SINCE_DEFAULT = '1.week.ago'; // Период по умолчанию
const GIT_REPO_URL_CACHE = { url: null }; // Кэш для URL репозитория

// Типы коммитов и их заголовки для отчета
const COMMIT_TYPES = {
  feat: '✨ Новые возможности (Features)',
  fix: '🐛 Исправления (Fixes)',
  docs: '📝 Документация (Docs)',
  style: '💅 Стилизация (Styles)',
  refactor: '♻️ Рефакторинг (Refactoring)',
  perf: '⚡️ Производительность (Performance)',
  test: '✅ Тесты (Tests)',
  build: '🏗️ Сборка (Build System)',
  ci: '🔄 CI/CD',
  chore: '🛠️ Технические задачи (Chores)',
  other: '⚙️ Прочее',
};

// --- Вспомогательные функции ---

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}\nStderr: ${stderr}`);
        return reject(new Error(`Command failed: ${command}\n${stderr}`));
      }
      resolve(stdout.trim());
    });
  });
}

async function getGitRepoUrl() {
  if (GIT_REPO_URL_CACHE.url) return GIT_REPO_URL_CACHE.url;
  try {
    const remoteOutput = await runCommand('git remote -v');
    const originFetchLine = remoteOutput.split('\n').find(line => line.startsWith('origin') && line.endsWith('(fetch)'));
    if (originFetchLine) {
      const match = originFetchLine.match(/origin\s+(.+)\s+\(fetch\)/);
      if (match && match[1]) {
        let url = match[1];
        if (url.startsWith('git@')) { // SSH URL
          url = url.replace(':', '/').replace('git@', 'https://');
        }
        if (url.endsWith('.git')) {
          url = url.slice(0, -4);
        }
        GIT_REPO_URL_CACHE.url = url;
        return url;
      }
    }
  } catch (error) {
    console.warn('Не удалось определить URL Git репозитория:', error.message);
  }
  return null;
}

function parseGitLog(logOutput) {
  const commits = [];
  // Используем более надежный разделитель и формат
  const commitEntries = logOutput.split('<----COMMIT_END---->');

  commitEntries.forEach(entry => {
    if (entry.trim() === '') return;

    const lines = entry.trim().split('\n');
    const commitData = {};
    let fileChangesPart = false;
    let bodyBuffer = [];

    commitData.hash = lines.shift(); // Полный хеш
    commitData.shortHash = lines.shift(); // Короткий хеш
    commitData.authorName = lines.shift();
    commitData.authorEmail = lines.shift(); // Не используется в отчете, но можно сохранить
    commitData.date = lines.shift(); // YYYY-MM-DD
    commitData.subject = lines.shift(); // Тема

    // Остальное - тело коммита и измененные файлы
    const bodyAndFiles = lines.join('\n');
    const filesMarker = "\nChanged files:\n";
    const filesStartIndex = bodyAndFiles.indexOf(filesMarker);

    if (filesStartIndex !== -1) {
        commitData.body = bodyAndFiles.substring(0, filesStartIndex).trim();
        const filesStr = bodyAndFiles.substring(filesStartIndex + filesMarker.length).trim();
        commitData.changedFiles = filesStr.split('\n').map(f => f.trim()).filter(f => f);
    } else {
        commitData.body = bodyAndFiles.trim();
        commitData.changedFiles = [];
    }
    
    commits.push(commitData);
  });
  return commits;
}

function groupCommits(commits) {
  const grouped = {};
  Object.keys(COMMIT_TYPES).forEach(type => grouped[type] = []);

  commits.forEach(commit => {
    const subject = commit.subject.toLowerCase();
    let typeFound = false;
    for (const type in COMMIT_TYPES) {
      if (subject.startsWith(type + ':') || subject.startsWith(type + '(')) {
        grouped[type].push(commit);
        typeFound = true;
        break;
      }
    }
    if (!typeFound) {
      grouped.other.push(commit);
    }
  });
  return grouped;
}

async function generateMarkdown(groupedCommits, date, repoUrl) {
  let markdown = `# Журнал прогресса разработки - ${date}\n\n`;
  let changesFound = false;

  for (const type in groupedCommits) {
    const commitsOfType = groupedCommits[type];
    if (commitsOfType.length > 0) {
      changesFound = true;
      markdown += `## ${COMMIT_TYPES[type]}\n\n`;
      commitsOfType.forEach(commit => {
        let commitLine = `- ${commit.subject}`;
        if (repoUrl) {
          commitLine += ` ([${commit.shortHash}](${repoUrl}/commit/${commit.hash}))`;
        } else {
          commitLine += ` (${commit.shortHash})`;
        }
        commitLine += ` (Автор: ${commit.authorName})\n`;
        markdown += commitLine;

        if (commit.body) {
          markdown += `  \`\`\`\n  ${commit.body.split('\n').map(l => l.trim()).join('\n  ')}\n  \`\`\`\n`;
        }
        // Опционально: добавить измененные файлы
        // if (commit.changedFiles.length > 0) {
        //   markdown += `    *Измененные файлы: ${commit.changedFiles.join(', ')}*\n`;
        // }
      });
      markdown += '\n';
    }
  }

  if (!changesFound) {
    markdown += "За выбранный период не найдено значимых коммитов для отчета.\n";
  }
  return markdown;
}

// --- Логика генерации отчета ---
async function generateReport(sinceDate) {
  const today = new Date().toISOString().split('T')[0];
  const outputFileName = `${today}-progress.md`;
  const outputFilePath = path.join(PROGRESS_DIR, outputFileName);

  console.log(`Генерация отчета о прогрессе за период с ${sinceDate} по ${today}...`);

  const repoUrl = await getGitRepoUrl();
  const gitLogCommand = `git log --since="${sinceDate}" --pretty="format:%H%n%h%n%an%n%ae%n%ad%n%s%n%b%nChanged files:%n%n<----COMMIT_END---->" --name-only`;
  
  const logOutput = await runCommand(gitLogCommand);

  if (!logOutput) {
    console.log('Нет коммитов для обработки за указанный период.');
    const markdownContent = `# Журнал прогресса разработки - ${today}\n\nЗа выбранный период не найдено коммитов.\n`;
    await fs.mkdir(PROGRESS_DIR, { recursive: true });
    await fs.writeFile(outputFilePath, markdownContent);
    console.log(`Отчет сохранен в ${outputFilePath}`);
    return outputFilePath;
  }
  
  const commits = parseGitLog(logOutput);

  if (commits.length === 0) {
    console.log('Нет коммитов для обработки после парсинга.');
    const markdownContent = `# Журнал прогресса разработки - ${today}\n\nЗа выбранный период не найдено коммитов для отчета.\n`;
    await fs.mkdir(PROGRESS_DIR, { recursive: true });
    await fs.writeFile(outputFilePath, markdownContent);
    console.log(`Отчет сохранен в ${outputFilePath}`);
    return outputFilePath;
  }

  const groupedCommits = groupCommits(commits);
  const markdownContent = await generateMarkdown(groupedCommits, today, repoUrl);

  await fs.mkdir(PROGRESS_DIR, { recursive: true });
  await fs.writeFile(outputFilePath, markdownContent);

  console.log(`Отчет о прогрессе успешно сгенерирован и сохранен в ${outputFilePath}`);
  return outputFilePath;
}

// --- Основная функция для CLI ---
async function main() {
  try {
    const since = process.argv[2] || COMMITS_SINCE_DEFAULT;
    await generateReport(since);
  } catch (error) {
    console.error('Ошибка при генерации отчета о прогрессе из CLI:', error.message);
    process.exit(1);
  }
}

// Если запускается напрямую из CLI
if (require.main === module) {
  main();
}

module.exports = {
  generateReport, // Экспортируем функцию для использования в других скриптах
  // Для documentation-updater.js может быть удобнее иметь функцию без параметров,
  // которая использует COMMITS_SINCE_DEFAULT или другую логику по умолчанию.
  generateCurrentProgressReport: () => generateReport(COMMITS_SINCE_DEFAULT)
};

// .vscode/documentation-updater.js
// ВАЖНО: Этот скрипт предназначен для иллюстрации интеграции с VS Code.
// Для полноценной работы с API VS Code (require('vscode')) он должен быть частью
// настоящего расширения VS Code и запускаться в его контексте.
// При запуске как обычный Node.js скрипт, части с 'vscode' API вызовут ошибку.

// Попытка загрузить 'vscode' API. Будет работать только в среде расширения.
let vscode;
try {
  vscode = require('vscode');
} catch (error) {
  console.warn('Модуль "vscode" не доступен. Скрипт будет работать в ограниченном режиме (без UI VS Code).');
  // Создадим заглушки для vscode API, чтобы скрипт не падал при обычном запуске Node.js
  vscode = {
    window: {
      showInformationMessage: async (message, ...items) => {
        console.log(`[VSCODE MOCK] showInformationMessage: ${message} | Items: ${items.join(', ')}`);
        // Имитируем выбор первого действия для автоматического тестирования
        if (items.includes('Обновить')) return 'Обновить';
        if (items.includes('Показать детали')) return 'Показать детали';
        return undefined;
      },
      showErrorMessage: async (message) => {
        console.error(`[VSCODE MOCK] showErrorMessage: ${message}`);
      }
    },
    Uri: {
      file: (path) => ({ fsPath: path, scheme: 'file' }) // Упрощенная заглушка
    },
    commands: {
      executeCommand: async (command, ...args) => {
        console.log(`[VSCODE MOCK] executeCommand: ${command} | Args: ${args.join(', ')}`);
        if (command === 'markdown.showPreview' && args[0] && args[0].fsPath) {
            console.log(`[VSCODE MOCK] Попытка показать превью для: ${args[0].fsPath}`);
            // Здесь можно было бы открыть файл в браузере или вывести его содержимое, если это CLI
        }
      }
    }
  };
}

const path = require('path');
// Пути к скриптам теперь должны быть относительны текущего файла, если он в .vscode
const { checkAndProposeDocumentationUpdates, executeDocumentationUpdates } = require('../scripts/docs/documentation-updater');

// Функция для показа уведомления с предложением обновить документацию
async function showDocumentationUpdateProposal() {
  console.log("VS Code Integration: Проверка необходимости обновления документации...");
  try {
    const result = await checkAndProposeDocumentationUpdates();
    
    if (result.shouldUpdate && result.proposalPath) {
      const response = await vscode.window.showInformationMessage(
        'Обнаружены триггеры для обновления документации проекта.',
        'Показать детали', // Button 1
        'Обновить сейчас',   // Button 2
        'Позже'             // Button 3
      );
      
      const proposalFilePath = path.join(__dirname, '..', result.proposalPath); // Корректный путь к файлу

      if (response === 'Показать детали') {
        const proposalUri = vscode.Uri.file(proposalFilePath);
        await vscode.commands.executeCommand('markdown.showPreview', proposalUri);
        
        const secondResponse = await vscode.window.showInformationMessage(
          'Хотите выполнить предложенные обновления документации сейчас?',
          'Обновить',
          'Позже'
        );
        
        if (secondResponse === 'Обновить') {
          const actions = result.checkpoints.flatMap(cp => cp.actions);
          await vscode.window.withProgress({
            location: vscode.ProgressLocation ? vscode.ProgressLocation.Notification : 15, // Уведомление
            title: "Обновление документации...",
            cancellable: false
          }, async (progress) => {
            progress.report({ increment: 0, message: "Запуск обновления..." });
            const executionResults = await executeDocumentationUpdates(actions);
            // TODO: Показать результаты выполнения пользователю
            console.log("Результаты выполнения обновлений:", executionResults);
            progress.report({ increment: 100, message: "Готово!" });
          });
          vscode.window.showInformationMessage('Документация успешно обновлена!');
        }
      } 
      else if (response === 'Обновить сейчас') {
        const actions = result.checkpoints.flatMap(cp => cp.actions);
        await vscode.window.withProgress({
            location: vscode.ProgressLocation ? vscode.ProgressLocation.Notification : 15,
            title: "Обновление документации...",
            cancellable: false
          }, async (progress) => {
            progress.report({ increment: 0, message: "Запуск обновления..." });
            const executionResults = await executeDocumentationUpdates(actions);
            console.log("Результаты выполнения обновлений:", executionResults);
            progress.report({ increment: 100, message: "Готово!" });
        });
        vscode.window.showInformationMessage('Документация успешно обновлена!');
      }
    } else if (!result.shouldUpdate) {
      console.log("VS Code Integration: Обновление документации не требуется в данный момент.");
      // Можно показать тихое уведомление или ничего не делать
      // vscode.window.showInformationMessage('Проверка документации завершена, обновления не требуются.', { HIDE_TIMEOUT: 5000 });
    }
  } catch (error) {
    console.error("VS Code Integration: Ошибка при проверке/обновлении документации:", error);
    vscode.window.showErrorMessage(`Ошибка при работе с документацией: ${error.message}`);
  }
}

// Настройка интервала проверки (например, каждые 30 минут)
// В реальном расширении это было бы частью логики активации/деактивации.
// Для простого скрипта это будет работать, пока скрипт запущен.
// const CHECK_INTERVAL = 30 * 60 * 1000; // 30 минут
// setInterval(showDocumentationUpdateProposal, CHECK_INTERVAL);
// console.log(`VS Code Integration: Настроена периодическая проверка документации каждые ${CHECK_INTERVAL / 60000} минут.`);

// Также запускаем проверку один раз при "запуске" этого скрипта
// (в контексте расширения - при активации)
// showDocumentationUpdateProposal();

// Для запуска из VS Code Tasks или командной строки:
if (require.main === module) {
    console.log("Запуск проверки документации из CLI (имитация VS Code Integration)...");
    showDocumentationUpdateProposal().catch(console.error);
}

module.exports = {
    showDocumentationUpdateProposal
};

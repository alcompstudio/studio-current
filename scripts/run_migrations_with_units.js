const { exec } = require('child_process');
const path = require('path');

// Путь к скрипту apply-migrations
const applyMigrationsPath = path.join(__dirname, 'apply-migrations.js');

// Выполняем скрипт apply-migrations
exec(`node ${applyMigrationsPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка выполнения миграций: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Результат выполнения миграций:\n${stdout}`);
  
  // После миграций запускаем сидеры при необходимости
  console.log('Миграции успешно применены');
});

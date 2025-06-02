/**
 * Скрипт для подготовки архива к деплою
 * Запускать: node scripts/prepare-deploy.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Название архива
const archiveName = 'studio_app_deploy.tar.gz';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const archiveWithTimestamp = `studio_app_deploy_${timestamp}.tar.gz`;

console.log('📦 Подготовка проекта к деплою...\n');

try {
  // Проверка существования .env.docker
  if (!fs.existsSync(path.join(process.cwd(), '.env.docker'))) {
    console.error('❌ Файл .env.docker не найден. Необходим для деплоя на сервер.');
    process.exit(1);
  }

  // Проверка существования docker-compose.yml
  if (!fs.existsSync(path.join(process.cwd(), 'docker-compose.yml'))) {
    console.error('❌ Файл docker-compose.yml не найден. Необходим для деплоя на сервер.');
    process.exit(1);
  }

  // Проверка существования Dockerfile
  if (!fs.existsSync(path.join(process.cwd(), 'Dockerfile'))) {
    console.error('❌ Файл Dockerfile не найден. Необходим для деплоя на сервер.');
    process.exit(1);
  }

  // Создание архива
  console.log('🔧 Создание архива проекта...');
  
  try {
    // Проверим, есть ли git
    const hasGit = fs.existsSync(path.join(process.cwd(), '.git'));
    
    if (hasGit) {
      // Используем git archive, если есть git репозиторий
      execSync(`git archive --format=tar.gz -o ${archiveWithTimestamp} HEAD`, { stdio: 'inherit' });
    } else {
      // Если нет git, используем обычный архиватор
      console.log('⚠️ Директория .git не найдена. Используем обычный архиватор.');
      
      // В Windows используем PowerShell для создания архива
      const command = `powershell -Command "Compress-Archive -Path * -DestinationPath ${archiveWithTimestamp.replace('.tar.gz', '.zip')} -Force"`;
      execSync(command, { stdio: 'inherit' });
      
      console.log(`✅ Создан архив ${archiveWithTimestamp.replace('.tar.gz', '.zip')}`);
      console.log('⚠️ Обратите внимание: этот архив включает все файлы, включая node_modules.');
      console.log('   Рекомендуется использовать Git для более эффективного создания архивов.');
      process.exit(0);
    }
    
    console.log(`✅ Архив создан: ${archiveWithTimestamp}`);
    
    // Копируем .env.docker в архив
    console.log('\n📝 Проверка содержимого .env.docker...');
    const envDocker = fs.readFileSync(path.join(process.cwd(), '.env.docker'), 'utf8');
    
    // Проверяем, содержит ли файл строки-заполнители, которые нужно заменить
    if (envDocker.includes('ваш_домен_или_ip_адрес')) {
      console.log('⚠️ В файле .env.docker найдены строки-заполнители:');
      console.log('   - "ваш_домен_или_ip_адрес" в NEXT_PUBLIC_API_URL');
      console.log('\n⚠️ Не забудьте изменить эти значения при деплое на сервер!');
    }
    
    console.log('\n✅ Подготовка к деплою завершена!');
    console.log('\n📋 Следующие шаги:');
    console.log(`1. Скопируйте архив ${archiveWithTimestamp} на сервер`);
    console.log('2. Распакуйте архив на сервере в директорию проекта');
    console.log('3. Скопируйте .env.docker в .env и внесите необходимые изменения');
    console.log('4. Запустите docker-compose up -d');
    
  } catch (error) {
    console.error(`❌ Ошибка при создании архива: ${error.message}`);
    process.exit(1);
  }
  
} catch (error) {
  console.error(`❌ Ошибка: ${error.message}`);
  process.exit(1);
}

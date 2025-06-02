/**
 * Скрипт для проверки Docker-конфигурации
 * Запускать: node scripts/check-docker-config.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Проверка Docker-конфигурации...\n');

// Проверка наличия файлов
const requiredFiles = [
  'Dockerfile',
  'docker-compose.yml',
  '.env.docker',
  'scripts/db-init/01-init.sql'
];

let missingFiles = [];
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.error('❌ Отсутствуют необходимые файлы:');
  missingFiles.forEach(file => {
    console.error(`   - ${file}`);
  });
  console.error('\nУбедитесь, что все необходимые файлы существуют.');
  process.exit(1);
}

console.log('✅ Все необходимые файлы найдены.');

// Проверка Dockerfile
try {
  console.log('\n🔍 Проверка Dockerfile...');
  const dockerfile = fs.readFileSync(path.join(process.cwd(), 'Dockerfile'), 'utf8');
  
  // Проверка на наличие необходимых инструкций
  const requiredInstructions = [
    'FROM node:18-alpine AS builder',
    'ARG NODE_ENV',
    'ARG DB_NAME',
    'ARG DB_USERNAME',
    'ARG DB_PASSWORD',
    'WORKDIR /app',
    'EXPOSE 3000',
    'CMD'
  ];
  
  let missingInstructions = [];
  requiredInstructions.forEach(instruction => {
    if (!dockerfile.includes(instruction)) {
      missingInstructions.push(instruction);
    }
  });
  
  if (missingInstructions.length > 0) {
    console.warn('⚠️ В Dockerfile отсутствуют или не соответствуют некоторые инструкции:');
    missingInstructions.forEach(instruction => {
      console.warn(`   - ${instruction}`);
    });
  } else {
    console.log('✅ Dockerfile содержит все необходимые инструкции.');
  }
  
} catch (error) {
  console.error(`❌ Ошибка при проверке Dockerfile: ${error.message}`);
}

// Проверка docker-compose.yml
try {
  console.log('\n🔍 Проверка docker-compose.yml...');
  const dockerCompose = fs.readFileSync(path.join(process.cwd(), 'docker-compose.yml'), 'utf8');
  
  // Проверка на наличие необходимых сервисов
  const requiredServices = ['app', 'db'];
  
  let missingServices = [];
  requiredServices.forEach(service => {
    if (!dockerCompose.includes(`  ${service}:`)) {
      missingServices.push(service);
    }
  });
  
  if (missingServices.length > 0) {
    console.warn('⚠️ В docker-compose.yml отсутствуют некоторые сервисы:');
    missingServices.forEach(service => {
      console.warn(`   - ${service}`);
    });
  } else {
    console.log('✅ docker-compose.yml содержит все необходимые сервисы.');
  }
  
} catch (error) {
  console.error(`❌ Ошибка при проверке docker-compose.yml: ${error.message}`);
}

// Проверка .env.docker
try {
  console.log('\n🔍 Проверка .env.docker...');
  const envDocker = fs.readFileSync(path.join(process.cwd(), '.env.docker'), 'utf8');
  
  // Проверка на наличие необходимых переменных
  const requiredVars = [
    'DATABASE_URL',
    'DB_NAME',
    'DB_USERNAME',
    'DB_PASSWORD',
    'NODE_ENV',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD'
  ];
  
  let missingVars = [];
  requiredVars.forEach(variable => {
    if (!envDocker.includes(`${variable}=`)) {
      missingVars.push(variable);
    }
  });
  
  if (missingVars.length > 0) {
    console.warn('⚠️ В .env.docker отсутствуют некоторые переменные:');
    missingVars.forEach(variable => {
      console.warn(`   - ${variable}`);
    });
  } else {
    console.log('✅ .env.docker содержит все необходимые переменные.');
  }
  
  // Проверка на использование значений по умолчанию
  if (envDocker.includes('POSTGRES_PASSWORD=postgres') || 
      envDocker.includes('DB_PASSWORD=postgres')) {
    console.warn('⚠️ В .env.docker используются стандартные пароли. Рекомендуется заменить их на более безопасные перед деплоем на сервер.');
  }
  
  // Проверка URL API
  if (envDocker.includes('ваш_домен_или_ip_адрес')) {
    console.warn('⚠️ В .env.docker найдена строка-заполнитель для NEXT_PUBLIC_API_URL. Замените её перед деплоем на сервер.');
  }
  
} catch (error) {
  console.error(`❌ Ошибка при проверке .env.docker: ${error.message}`);
}

// Проверка установки Docker
try {
  console.log('\n🔍 Проверка установки Docker...');
  
  try {
    const dockerVersion = execSync('docker --version', { stdio: 'pipe' }).toString().trim();
    console.log(`✅ Docker установлен: ${dockerVersion}`);
  } catch (error) {
    console.warn('⚠️ Docker не установлен или не найден в PATH. Убедитесь, что Docker установлен перед тестированием Docker-конфигурации.');
  }
  
  try {
    const dockerComposeVersion = execSync('docker-compose --version', { stdio: 'pipe' }).toString().trim();
    console.log(`✅ Docker Compose установлен: ${dockerComposeVersion}`);
  } catch (error) {
    console.warn('⚠️ Docker Compose не установлен или не найден в PATH. Убедитесь, что Docker Compose установлен перед тестированием Docker-конфигурации.');
  }
  
} catch (error) {
  console.error(`❌ Ошибка при проверке установки Docker: ${error.message}`);
}

console.log('\n✅ Проверка Docker-конфигурации завершена.');
console.log('\n📋 Следующие шаги:');
console.log('1. Для тестирования Docker-конфигурации локально:');
console.log('   - Запустите docker-compose up -d');
console.log('   - Проверьте работу приложения по адресу http://localhost:3000');
console.log('2. Для деплоя на сервер:');
console.log('   - Запустите node scripts/prepare-deploy.js');
console.log('   - Следуйте инструкциям по копированию и настройке на сервере');

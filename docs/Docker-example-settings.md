 ## Dockerize: идеальный подход для развертывания веб-приложения

Для решения вашей проблемы совместимости локальной среды разработки (Windows 11) и удаленного сервера (Ubuntu 20.04) я рекомендую использовать Docker. Это позволит создать идентичное окружение для приложения независимо от операционной системы.

### 1. Преимущества использования Docker

- **Одинаковая среда выполнения** - локально и на сервере будут абсолютно одинаковые условия
- **Изоляция зависимостей** - все необходимые компоненты будут внутри контейнеров
- **Простота обновления** - обновление приложения сводится к замене контейнеров
- **Масштабируемость** - легко добавлять новые сервисы по мере роста приложения
- **Безопасность** - каждый компонент работает в собственной изолированной среде

### 2. Необходимые компоненты решения

Для полноценной Docker-инфраструктуры веб-приложения на React/Node.js/PostgreSQL вам понадобится:

1. **Docker и Docker Compose** - установите их локально и на сервере Hetzner
2. **Три основных контейнера**:
   - Frontend (React + Tailwind)
   - Backend (Node.js)
   - Database (PostgreSQL)
3. **Nginx в качестве прокси-сервера** - для маршрутизации запросов
4. **Инструмент для управления БД** - pgAdmin или Adminer

### 3. Структура проекта и docker-compose.yml

Вот пример структуры проекта с использованием Docker:

```
project/
├── frontend/            # React приложение
│   ├── Dockerfile       # Инструкции для сборки контейнера
│   └── ...              # Остальные файлы React проекта
├── backend/             # Node.js приложение
│   ├── Dockerfile       # Инструкции для сборки контейнера 
│   ├── migrations/      # Миграции базы данных
│   └── ...              # Остальные файлы Node.js проекта
├── nginx/               # Настройки Nginx
│   ├── Dockerfile
│   └── default.conf     # Конфигурация
├── pgadmin/             # (опционально) Папка для данных pgAdmin
├── data/                # Постоянное хранилище для БД
└── docker-compose.yml   # Главный файл конфигурации
```

Вот пример `docker-compose.yml` файла:

```yaml
version: '3'

services: 
  backend:
    build:
      context: ./backend
    container_name: backend
    working_dir: /usr/src/app
    networks:
      - app-network
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - "3000:3000"
    command: npm run start
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
    container_name: frontend
    working_dir: /usr/src/app
    networks:
      - app-network
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - "5173:5173"
    command: npm run dev
    restart: unless-stopped

  db:
    image: postgres:14
    container_name: postgres
    restart: always
    volumes:
      - ./data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=your_secure_password
      - POSTGRES_USER=postgres
      - POSTGRES_DB=app_database
    ports:
      - "5432:5432"
    networks:
      - app-network

  nginx:
    build:
      context: ./nginx
    container_name: nginx
    restart: always
    ports:
      - "80:80"
    networks:
      - app-network
    depends_on:
      - backend
      - frontend

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@example.com
      - PGADMIN_DEFAULT_PASSWORD=your_secure_password
    volumes:
      - ./pgadmin:/var/lib/pgadmin
    networks:
      - app-network
    depends_on:
      - db

networks:
  app-network:
    driver: bridge
```

### 4. Dockerfile для frontend и backend

**Dockerfile для frontend (React):**

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Команда будет переопределена в docker-compose.yml
CMD ["npm", "run", "dev"]
```

**Dockerfile для backend (Node.js):**

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Команда будет переопределена в docker-compose.yml
CMD ["npm", "run", "start"]
```

### 5. Nginx конфигурация

Создайте файл `nginx/default.conf`:

```nginx
upstream frontend {
    server frontend:5173;
}

upstream backend {
    server backend:3000;
}

server {
    listen 80;
    
    # Frontend (React)
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket для Hot Module Replacement (HMR)
    location /sockjs-node {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

И Dockerfile для Nginx:

```dockerfile
FROM nginx:alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
```

### 6. Управление миграциями базы данных

Для управления миграциями базы данных у вас есть два основных варианта:

#### Вариант 1: Использование Sequelize ORM

Sequelize - популярный Node.js ORM для работы с PostgreSQL, который имеет встроенную систему миграций:

1. Установите Sequelize CLI:
   ```bash
   npm install --save sequelize sequelize-cli pg pg-hstore
   ```

2. Создайте файл `.sequelizerc` в корневой директории:
   ```javascript
   const path = require('path');
   
   module.exports = {
     'config': path.resolve('config', 'database.js'),
     'models-path': path.resolve('models'),
     'seeders-path': path.resolve('seeders'),
     'migrations-path': path.resolve('migrations')
   };
   ```

3. Инициализируйте Sequelize:
   ```bash
   npx sequelize-cli init
   ```

4. Пример создания миграции:
   ```bash
   npx sequelize-cli migration:generate --name create-users-table
   ```

5. Выполните миграции в контейнере:
   ```bash
   docker-compose exec backend npx sequelize-cli db:migrate
   ```

#### Вариант 2: Использование Knex.js

Knex.js - SQL-конструктор запросов с поддержкой миграций:

1. Установите Knex:
   ```bash
   npm install knex pg
   ```

2. Инициализируйте Knex:
   ```bash
   npx knex init
   ```

3. Создайте миграцию:
   ```bash
   npx knex migrate:make create_users_table
   ```

4. Выполните миграции в контейнере:
   ```bash
   docker-compose exec backend npx knex migrate:latest
   ```

### 7. Процесс развертывания (CI/CD)

Для автоматизации процесса развертывания можно использовать GitHub Actions. Вот пример файла конфигурации `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd ~/your-project-directory
          git pull
          docker-compose down
          docker-compose up --build -d
```

### 8. Пошаговое руководство по развертыванию

1. **Установка Docker на сервер Hetzner**:
   ```bash
   # Обновите пакеты
   sudo apt update
   
   # Установите необходимые пакеты
   sudo apt install apt-transport-https ca-certificates curl software-properties-common

   # Добавьте официальный GPG-ключ Docker
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

   # Добавьте репозиторий Docker
   echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Обновите пакеты и установите Docker
   sudo apt update
   sudo apt install docker-ce docker-ce-cli containerd.io

   # Установите Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

   # Добавьте текущего пользователя в группу docker
   sudo usermod -aG docker $USER
   ```

2. **Клонирование проекта на сервер**:
   ```bash
   git clone https://github.com/your-username/your-project.git
   cd your-project
   ```

3. **Запуск контейнеров**:
   ```bash
   docker-compose up -d --build
   ```

4. **Выполнение миграций базы данных**:
   ```bash
   docker-compose exec backend npm run migrate
   ```

5. **Проверка работоспособности**:
   Откройте в браузере `http://ваш_ip_адрес`

### 9. Инструменты визуального управления БД

В docker-compose.yml уже включен pgAdmin - мощный инструмент управления PostgreSQL с веб-интерфейсом. После запуска он будет доступен по адресу `http://ваш_ip_адрес:8080`

Альтернативно можно использовать Adminer - более легкий инструмент:

```yaml
# Добавьте в секцию services в docker-compose.yml
adminer:
  image: adminer
  container_name: adminer
  restart: unless-stopped
  ports:
    - "8081:8080"
  networks:
    - app-network
  depends_on:
    - db
```

Он будет доступен по адресу `http://ваш_ip_адрес:8081`

### 10. Процесс обновления приложения

После Docker-настройки процесс обновления становится очень простым:

1. **Обновите код локально и протестируйте**:
   ```bash
   # Локально запустите приложение с Docker
   docker-compose up -d
   # Проверьте, что все работает
   ```

2. **Залейте изменения в Git-репозиторий**:
   ```bash
   git add .
   git commit -m "Обновление функционала X"
   git push
   ```

3. **Если вы используете CI/CD с GitHub Actions** - обновление произойдет автоматически

4. **Если вы делаете обновление вручную**:
   ```bash
   # На удаленном сервере
   cd ~/your-project-directory
   git pull
   docker-compose down
   docker-compose up -d --build
   # При необходимости выполните миграции
   docker-compose exec backend npm run migrate
   ```

### 11. Безопасность и оптимизация

1. **Используйте файл .env для хранения секретов**:
   ```
   DB_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret
   ```

2. **Изолируйте контейнеры с помощью сетей**:
   В примере выше используется одна сеть `app-network`. Для большей безопасности можно разделить фронтенд и бэкенд на разные сети.

3. **Используйте volumes для сохранения данных**:
   ```yaml
   volumes:
     - ./data:/var/lib/postgresql/data
   ```

4. **Настройте логирование**:
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

### 12. Рекомендованные инструменты для упрощения работы

1. **Portainer** - визуальное управление Docker-контейнерами:
   ```yaml
   # Добавьте в docker-compose.yml
   portainer:
     image: portainer/portainer-ce:latest
     container_name: portainer
     restart: unless-stopped
     security_opt:
       - no-new-privileges:true
     volumes:
       - /etc/localtime:/etc/localtime:ro
       - /var/run/docker.sock:/var/run/docker.sock:ro
       - ./portainer-data:/data
     ports:
       - "9000:9000"
   ```

2. **Watchtower** - автоматическое обновление контейнеров:
   ```yaml
   # Добавьте в docker-compose.yml
   watchtower:
     image: containrrr/watchtower
     container_name: watchtower
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
     command: --interval 30 --cleanup
   ```

## Заключение

Использование Docker для развертывания вашего приложения React/Node.js/PostgreSQL обеспечит максимальную совместимость между средами разработки и продакшена, а также значительно упростит процесс обновления. Docker абстрагирует различия между операционными системами, позволяя сосредоточиться на разработке функционала, а не на решении проблем с инфраструктурой.

Последовательное использование миграций базы данных (Sequelize или Knex.js) поможет поддерживать схему БД в актуальном состоянии. А использование инструментов визуального управления PostgreSQL (pgAdmin или Adminer) упростит работу с базой данных.

Для дополнительного удобства можно настроить CI/CD пайплайн с помощью GitHub Actions, который будет автоматически обновлять приложение на сервере при изменениях в репозитории.
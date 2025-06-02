# Этап сборки
FROM node:18-alpine AS builder

# Определение аргументов сборки
ARG NODE_ENV
ARG DB_NAME
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG DB_DIALECT

# Установка переменных окружения для этапа сборки
ENV NODE_ENV=${NODE_ENV:-production}
ENV DB_NAME=${DB_NAME:-studio_db}
ENV DB_USERNAME=${DB_USERNAME:-postgres}
ENV DB_PASSWORD=${DB_PASSWORD:-postgres}
ENV DB_HOST=${DB_HOST:-db}
ENV DB_PORT=${DB_PORT:-5432}
ENV DB_DIALECT=${DB_DIALECT:-postgres}
ENV DOCKER_ENV=true

WORKDIR /app

# Копирование файлов зависимостей
COPY package.json package-lock.json ./

# Установка зависимостей с флагом legacy-peer-deps для решения конфликтов
# Используем --ignore-scripts для пропуска хуков husky
RUN npm ci --legacy-peer-deps --ignore-scripts

# Копирование остальных файлов проекта
COPY . .

# Сборка приложения с передачей переменных окружения
RUN npm run build

# Производственный этап
FROM node:18-alpine AS runner

WORKDIR /app

# Установка переменных окружения для этапа запуска
ENV NODE_ENV=production

# Копирование необходимых файлов для запуска
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Экспозиция порта
EXPOSE 3000

# Команда запуска приложения
CMD ["npm", "run", "start"]

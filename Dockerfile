# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копирование файлов зависимостей
COPY package.json package-lock.json ./

# Установка зависимостей с флагом legacy-peer-deps для решения конфликтов
RUN npm ci --legacy-peer-deps

# Копирование остальных файлов проекта
COPY . .

# Сборка приложения
RUN npm run build

# Производственный этап
FROM node:18-alpine AS runner

WORKDIR /app

# Копирование необходимых файлов для запуска
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Экспозиция порта
EXPOSE 3000

# Переменные среды
ENV NODE_ENV=production

# Запуск приложения
CMD ["npm", "run", "start"]

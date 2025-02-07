# Используем базовый образ Node.js
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем приложение
RUN yarn build

# Используем легкий образ Node.js для продакшена
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только необходимые файлы
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Открываем порт 3000
EXPOSE 5000

# Запускаем приложение
CMD ["yarn", "start:prod"]
FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 10000

CMD ["node", "server/index.js"]

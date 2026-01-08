FROM node:20-alpine AS build

ARG VITE_GRAFANA_URL=http://192.168.178.118:3000
ARG VITE_IOBROKER_API_URL=http://192.168.178.116:8087
ENV VITE_GRAFANA_URL=$VITE_GRAFANA_URL
ENV VITE_IOBROKER_API_URL=$VITE_IOBROKER_API_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY server.js ./server.js

ENV NODE_ENV=production
EXPOSE 80
CMD ["node", "server.js"]

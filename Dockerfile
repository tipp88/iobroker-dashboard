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

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=production

# ── Production stage ──────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist/frontodonto/browser /usr/share/nginx/html

ENV APP_PORT=4200

EXPOSE 80
EXPOSE 4200

# envsubst replaces only ${APP_PORT}; other nginx variables ($host, $uri…) are left intact
CMD ["sh", "-c", "envsubst '${APP_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
# CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]

# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=production

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist/frontodonto/browser ./dist

RUN npm install -g serve

EXPOSE 4200

CMD ["serve", "-s", "dist", "-l", "4200"]

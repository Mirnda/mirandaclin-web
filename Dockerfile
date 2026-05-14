# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=production

# ── Artifacts stage ───────────────────────────────────────────────────────────
# Nginx runs on the VM host; this stage only holds the built files so the
# deployment pipeline can copy them out with:
#   docker create --name tmp <image> && docker cp tmp:/app/dist/. <nginx-root> && docker rm tmp
FROM alpine:3

COPY --from=builder /app/dist/frontodonto/browser /app/dist

CMD ["sh", "-c", "echo 'dist files ready at /app/dist'"]

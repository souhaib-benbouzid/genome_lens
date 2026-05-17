# syntax=docker/dockerfile:1

# ── Builder ────────────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

# corepack ships with Node 20 — use it to activate the exact pnpm version
# declared in package.json#packageManager (pnpm@9.15.4)
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Install deps before copying source so this layer is cached on code-only changes
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json rspack.config.ts index.html ./
COPY src ./src

RUN pnpm build

# ── Runtime ────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

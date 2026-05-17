FROM node:lts-bullseye-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml .
RUN npm install -g pnpm@latest 
RUN pnpm install --frozen-lockfile

COPY tsconfig.json rspack.config.ts index.html .
COPY src ./src

RUN pnpm build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

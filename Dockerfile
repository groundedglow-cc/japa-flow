# syntax=docker/dockerfile:1

# -------------------------
# Build stage: install dependencies and build the student static bundle.
# -------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false

COPY . .

ARG OSS_ENABLED=false
ARG OSS_BASE_URL=
ENV OSS_ENABLED=$OSS_ENABLED
ENV OSS_BASE_URL=$OSS_BASE_URL

RUN npm run build:app

# -------------------------
# Runtime stage: nginx + node server.mjs
# -------------------------
FROM node:20-alpine AS runner

# Install nginx
RUN apk add --no-cache nginx && \
    mkdir -p /run/nginx /usr/share/nginx/html

# Copy static files
COPY --from=builder /app/app-dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy server code
WORKDIR /app
COPY --from=builder /app/server.mjs /app/package.json /app/package-lock.json /app/.npmrc ./
COPY --from=builder /app/scripts ./scripts
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false --omit=dev

EXPOSE 80

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
CMD ["/docker-entrypoint.sh"]

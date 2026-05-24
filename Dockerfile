# syntax=docker/dockerfile:1

# -------------------------
# Build stage: install dependencies and build the student static bundle.
# -------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Keep dependency installation cacheable and use the repo npm registry policy.
COPY package.json package-lock.json .npmrc ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false

COPY . .

# Public, non-secret build-time config for the static student app.
ARG OSS_ENABLED=false
ARG OSS_BASE_URL=
ENV OSS_ENABLED=$OSS_ENABLED
ENV OSS_BASE_URL=$OSS_BASE_URL

RUN npm run build:app

# -------------------------
# Runtime stage: nginx serves only the static student bundle.
# -------------------------
FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/app-dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

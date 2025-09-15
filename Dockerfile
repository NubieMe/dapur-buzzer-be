# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# install build deps
RUN apk add --no-cache python3 make g++ libc6-compat

# copy package metadata first for better caching
COPY package.json package-lock.json* yarn.lock* ./

# install deps (use npm by default)
RUN npm ci --production=false

# copy source
COPY . .

# compile TypeScript (if you add a build script that runs tsc)
# If you don't have build script, we'll still install tsx to run directly.
RUN npm run build || true

# ---- runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

# install only production deps
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --production=true

# copy compiled output or source + node_modules if using tsx
# prefer compiled dist if available
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env ./

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# expose port from your .env (default in .env: PORT=3210)
ARG PORT=3210
EXPOSE ${PORT}

# production start command (assumes you added start:prod)
CMD ["sh", "-c", "node ./dist/server.js || npx tsx src/server.ts"]

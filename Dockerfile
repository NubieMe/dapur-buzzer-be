# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --production=false

COPY . .

RUN npx prisma generate
RUN npm run build

# ---- runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --production=true

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ARG PORT=3210
EXPOSE ${PORT}

CMD ["node", "dist/server.js"]

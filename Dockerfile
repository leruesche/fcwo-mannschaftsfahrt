# =============================================================================
# Development Stage
# Uses local node_modules mounted from host - no install needed
# =============================================================================
FROM node:22-alpine AS dev

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# No COPY or install - everything is mounted from host
EXPOSE 3000

CMD ["pnpm", "dev"]

# =============================================================================
# Dependencies Stage
# =============================================================================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# =============================================================================
# Build Stage
# =============================================================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build Nuxt application
RUN pnpm build

# =============================================================================
# Production Stage
# =============================================================================
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy built application
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY package.json pnpm-lock.yaml ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

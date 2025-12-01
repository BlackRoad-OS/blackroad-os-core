FROM node:20-slim

WORKDIR /app

# Install OpenSSL and other required dependencies for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.8 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema for generation
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Generate Prisma client
RUN pnpm db:generate

# Copy source files
COPY . .

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Start the API server using tsx
CMD ["npx", "tsx", "src/api/server.ts"]

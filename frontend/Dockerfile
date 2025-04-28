# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Copy only the manifests & Next config
COPY package.json package-lock.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs /.env ./

# 2) Install deps
RUN npm ci

# 3) Copy your source
COPY app     ./app
COPY public  ./public
# (and any other folders: components/, etc.)

# 4) Build the Next.js site
RUN npm run build

 # ——— Runtime image ———
 FROM node:18-alpine AS runner
 WORKDIR /app
 ENV NODE_ENV=production

# 1) Copy the package manifests so npm start can run
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

 # 2) Bring in build output & deps
 COPY --from=builder /app/.next        ./.next
 COPY --from=builder /app/node_modules ./node_modules
 COPY --from=builder /app/public       ./public

 EXPOSE 3000
 CMD ["npm", "start"]

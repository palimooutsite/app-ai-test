FROM node:20-alpine AS builder
WORKDIR /app/backend

# bcrypt can fall back to native compilation on Alpine/musl.
# Ensure node-gyp prerequisites are available.
RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./
RUN npm ci

COPY backend ./
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app/backend
ENV NODE_ENV=production

# Keep toolchain available so bcrypt can be rebuilt for the runtime architecture
# (prebuilt artifacts can fail with "Exec format error" on mixed-arch environments).
RUN apk add --no-cache python3 make g++

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist

# Rebuild native bindings against the final runtime image architecture.
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000
CMD ["node", "dist/main.js"]

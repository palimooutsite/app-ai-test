FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
COPY backend ./
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/backend
ENV NODE_ENV=production
COPY --from=builder /app/backend/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]

FROM node:12 as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

# ---
# For even smaller images.

FROM node:12-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/public /app/public/
COPY server /app/server/
COPY common /app/common/

CMD ["node", "server/index.js"]
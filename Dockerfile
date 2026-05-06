FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./
COPY public ./public
RUN npm run build

# Remove dev dependencies for final image
RUN npm prune --omit=dev

EXPOSE 3000
CMD ["node", "dist/server.js"]

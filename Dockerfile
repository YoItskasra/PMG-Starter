FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source
COPY src ./src
COPY tsconfig.json ./
COPY public ./public

# Build TypeScript and CSS
RUN npm run build

# Remove dev dependencies
RUN npm ci --omit=dev --prefer-offline --no-audit

EXPOSE 3000
CMD ["node", "dist/server.js"]

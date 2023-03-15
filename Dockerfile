# Base stage for common instructions
FROM node:16.13.0 AS base
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm ci

COPY . /app

# Development stage
FROM base AS development
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development

EXPOSE 3000
CMD [ "npm", "run", "dev" ]

# Build stage for production
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM --platform=linux/amd64 node:16.13.0-alpine AS production
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=build /app /app

RUN npm ci --only=production
RUN npx prisma generate

EXPOSE 3000
CMD [ "npm", "start" ]

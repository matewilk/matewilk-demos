FROM node:16.13.0 AS development
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install
COPY . /app

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development

EXPOSE 3000
CMD [ "npm", "run", "dev" ]

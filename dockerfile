FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN apk add ttf-freefont

EXPOSE 3000

ENV NODE_ENV development
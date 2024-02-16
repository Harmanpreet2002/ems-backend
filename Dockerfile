FROM node:latest

RUN mkdir -p /usr/src/ems-backend && chown -R node:node /usr/src/ems-backend

WORKDIR /usr/src/ems-backend

COPY package-lock.json package.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000
FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

ENV DOCKER_API=true

RUN npm i

COPY . /usr/src/app

CMD ["npm", "run", "dev"]

EXPOSE 3000
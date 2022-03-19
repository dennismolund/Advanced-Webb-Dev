FROM node:14.15.4

EXPOSE 8080
EXPOSE 3002

WORKDIR /web-application

COPY package*.json ./

RUN npm install

COPY src/main.js ./

CMD ["npm","run","start"]
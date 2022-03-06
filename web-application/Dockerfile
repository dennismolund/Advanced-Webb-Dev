FROM node:14.15.4

EXPOSE 8080

WORKDIR /web-application

COPY package*.json ./

RUN npm install

COPY src/presentation-layer/app.js ./

CMD ["npm","run","start"]
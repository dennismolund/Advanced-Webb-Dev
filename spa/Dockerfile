FROM node:14.15.4

EXPOSE 3001

WORKDIR /spa

COPY package*.json ./

RUN npm install

COPY src/ ./

CMD ["npm","run","start"]
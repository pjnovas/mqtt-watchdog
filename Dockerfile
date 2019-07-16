FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1883:1883
EXPOSE 27017:27017

CMD [ "npm", "start" ]

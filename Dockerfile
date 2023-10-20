FROM node:20

ENV TZ="UTC"

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
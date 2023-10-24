FROM node:20

ENV TZ="UTC"

WORKDIR /home/node/app

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
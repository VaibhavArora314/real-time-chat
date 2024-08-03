FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npx tsc -b

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
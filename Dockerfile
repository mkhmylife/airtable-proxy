FROM node:14-alpine

CMD [ "node", "dist/index.js" ]
WORKDIR /app

COPY ./package.json ./yarn.lock /app/
RUN yarn

ADD . /app/
RUN yarn run build

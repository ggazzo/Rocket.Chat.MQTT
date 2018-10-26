FROM node:10.5 as build

WORKDIR /app

ADD src/ ./src
ADD .babelrc .
ADD package.json .

RUN npm install && \
    npm run build


FROM node:10.5-alpine

WORKDIR /app

COPY --from=build /app/lib/ .
ADD package.json .

ENV NODE_ENV=production

EXPOSE 1883
EXPOSE 80

RUN npm install
RUN npm prune --production

CMD ["node", "index.js"]

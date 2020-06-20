FROM node:12-alpine

ENV NODE_ENV production

# install the necessary packages into alpine linux
RUN apk --no-cache add curl ca-certificates git openssh tini

RUN mkdir -p /home/app

WORKDIR /home/app

ENV NPM_CONFIG_LOGLEVEL warn

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

RUN addgroup -S app && adduser -S -g app app

COPY . ./

RUN chown app:app -R /home/app && chmod 777 /tmp

USER app

EXPOSE 3000

CMD yarn build && yarn start

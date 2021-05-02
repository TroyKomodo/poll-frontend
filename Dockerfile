FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn

COPY . .
EXPOSE 3000


RUN yarn build

ENV HOST=0.0.0.0
ENV PORT=3000

CMD [ "yarn", "start" ]

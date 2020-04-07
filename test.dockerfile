FROM node:alpine
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock 

RUN yarn install --build-from-source

COPY . . 

CMD ["yarn", "test:unit"]
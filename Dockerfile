FROM node:alpine as builder
WORKDIR /app
COPY . . 
RUN yarn install && \
yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/example.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

FROM node:latest as build
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app 
COPY src/ /app
RUN yarn
RUN yarn build

FROM node:latest
WORKDIR /app
COPY --from=build /app/dist/* /app
CMD ["node app.js"]

FROM node:latest 
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app 
COPY src/ /app/src
RUN yarn
COPY tsconfig.json /app 
RUN yarn build
CMD ["dist/app.js"]

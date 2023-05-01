FROM node:latest

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 8082
# start app
CMD ["npm", "run", "start"]
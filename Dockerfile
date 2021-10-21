FROM node:14

RUN apt-get update -y && apt-get upgrade -y && apt-get -y install curl python build-essential git ca-certificates

ENV DEBUG="server:*"
ENV PORT="1337"
ENV JWT_SECRET="elishabello-28-03-1994-secret-key"

RUN mkdir -p /json-patch-microservice /json-patch-microservice/controllers /json-patch-microservice/middlewares /json-patch-microservice/public /json-patch-microservice/public/images /json-patch-microservice/public/images/thumbnails /json-patch-microservice/utils
COPY controllers/*.js /json-patch-microservice/controllers/
COPY middlewares/*.js /json-patch-microservice/middlewares/
COPY utils/*.js /json-patch-microservice/utils/
COPY *js package.json swagger.js /json-patch-microservice/

WORKDIR /json-patch-microservice

RUN npm install --unsafe-perm

EXPOSE 1337
CMD [ "node", "./server.js" ]

#https://hub.docker.com/r/elisha1994/json-patch-microservice

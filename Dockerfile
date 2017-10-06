FROM node:6.11

RUN apt-get update && apt-get install -y build-essential

ENV APP_HOME /payment-gateway

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ADD package.json $APP_HOME
RUN npm install

ADD . $APP_HOME

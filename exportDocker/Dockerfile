FROM node:18-bullseye

COPY . .

RUN apt-get update && apt-get install jq -y
RUN cd geth && tar -xf geth.tar.gz && rm geth.tar.gz
RUN cd contracts && npm install
FROM node:18.15.0-bullseye

COPY . .

RUN apt-get update && apt-get install jq -y
RUN cd geth && tar -xf geth.tar.gz && rm geth.tar.gz
RUN cd contracts && npm install
RUN cd web && npm install
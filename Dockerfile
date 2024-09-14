FROM node:18.20-alpine as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install

FROM node:18.20-alpine as final

COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY . /usr/src/app
EXPOSE 8081
CMD ["npm","start"]

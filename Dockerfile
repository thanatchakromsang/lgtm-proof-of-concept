FROM node:18.20-alpine as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

FROM node:18.20-alpine as final

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/package.json /usr/src/app/
COPY --from=build /usr/src/app/package-lock.json /usr/src/app/
COPY . /usr/src/app
EXPOSE 8081
HEALTHCHECK --interval=1m --timeout=5s \
  CMD curl -f http://localhost/readiness || exit 1
ENTRYPOINT ["npm"]
CMD ["start"]

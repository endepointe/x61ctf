FROM postgres:18-alpine3.22
RUN \
  apk update && \
  apk upgrade
RUN mkdir -p /docker-entrypoint-initdb.d/
COPY ./init.sql /docker-entrypoint-initdb.d/init.sql


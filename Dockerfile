FROM node:alpine

RUN mkdir /web

COPY ./web /web

WORKDIR /web

RUN npm ci && npm run build

FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7

ENV STATIC_PATH /app/static/static

COPY ./server /app

WORKDIR /app

RUN mkdir static && pip install -r requirements.txt

COPY --from=0 /web/build /app/static
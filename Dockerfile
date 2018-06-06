FROM node:alpine

RUN mkdir /web

COPY ./web /web

WORKDIR /web

RUN npm ci && npm run build

FROM joshuaavalon/flask-uwsgi-nginx-alpine

COPY ./server /app

RUN mkdir static && pip install -r /app/requirements.txt

COPY --from=0 /web/build /app/static
COPY app.conf /etc/nginx/conf.d/
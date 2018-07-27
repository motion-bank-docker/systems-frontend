FROM smebberson/alpine-nginx:1
MAINTAINER Motion Bank

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

ADD ./dist/spa-mat /usr/html/

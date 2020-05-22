# FROM node:10.19.0 AS build

# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# ENV GIT_DISCOVERY_ACROSS_FILESYSTEM=1
# COPY frontend /app
# COPY .git /.git
# RUN apt-get update && apt-get install -y libgl1-mesa-dev
# RUN npm ci
# RUN npm run production

FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
        perl \
        git \
        anacron \
        locales \
        pwgen \
        imagemagick \
        ffmpeg2theora \
        poppler-utils \
        libwpd-tools \
        exiftool \
        ghostscript \
        libreoffice \
        apache2 \
        libtcnative-1 \
        ffmpeg \
        gnupg2 \
        ca-certificates \
        wget \
        x264 &&\
        apt remove -y libtcnative-1

RUN mkdir -p /opt/fv/www/ && chown -R 1000:0 /opt/fv/www/ && chmod -R g+rwX /opt/fv/www/

RUN a2enmod headers && \
a2enmod proxy && \
a2enmod rewrite && \
a2enmod proxy_http && \
a2enmod ssl

# COPY --from=build /app/public /opt/fv/www/

# Test me -- if this works... all above is not needed!!!
ADD https://dist.firstvoices.io/public.tar.gz /opt/fv/www
RUN tar -xzf public.tar.gz && rm public.tar.gz

COPY docker/apache2/000-default.conf /etc/apache2/sites-enabled/000-default.conf

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# Launch Apache
CMD /wait && /usr/sbin/apache2ctl -DFOREGROUND
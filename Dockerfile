FROM ubuntu:18.04

# By default add the latest distribution (should be LTS)
# Distribution options: Default is dev (unstable) or a specific version in the format 3.3.0(-RC)
ARG DIST_VERSION=dev

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends apache2

RUN mkdir -p /opt/fv/www/ && chown -R 1000:0 /opt/fv/www/ && chmod -R g+rwX /opt/fv/www/

RUN a2enmod headers && \
a2enmod proxy && \
a2enmod rewrite && \
a2enmod proxy_http && \
a2enmod ssl

# Add prebuilt version of marketplace package
ADD https://s3.ca-central-1.amazonaws.com/firstvoices.com/dist/core/${DIST_VERSION}/public.tar.gz /app/ 
RUN tar -xzf public.tar.gz -C /opt/fv/www/ && rm public.tar.gz

COPY docker/apache2/000-default.conf /etc/apache2/sites-enabled/000-default.conf

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# Launch Apache
CMD /wait && /usr/sbin/apache2ctl -DFOREGROUND
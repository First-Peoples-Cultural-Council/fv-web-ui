FROM ubuntu:18.04

# By default add the latest distribution (should be LTS)
# Distribution options: Default is dev (unstable) or a specific version in the format 3.3.0(-RC)
ARG DIST_VERSION=dev

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends apache2

RUN mkdir -p /opt/fv/www/ && chown -R 1000:0 /opt/fv/www/ && chmod -R g+rwX /opt/fv/www/

# Create directory for V2
RUN mkdir -p /opt/fv/www/v2/ && chown -R 1000:0 /opt/fv/www/v2/ && chmod -R g+rwX /opt/fv/www/v2/

RUN a2enmod headers && \
a2enmod proxy && \
a2enmod rewrite && \
a2enmod proxy_http && \
a2enmod ssl

# Add prebuilt version of marketplace package
ADD https://s3.ca-central-1.amazonaws.com/firstvoices.com/dist/core/${DIST_VERSION}/public.tar.gz /app/
# Tar retains folder structure, so we need to extract 2 layers deep
RUN tar -C /opt/fv/www/ -xzf public.tar.gz --strip-components=2 && rm public.tar.gz

# Add prebuilt version of public artifact for v2 (for now copy)
ADD https://s3.ca-central-1.amazonaws.com/firstvoices.com/dist/core/${DIST_VERSION}/public_v2.tar.gz /app/
RUN tar -C /opt/fv/www/v2/ -xzf public_v2.tar.gz --strip-components=3 && rm public_v2.tar.gz

COPY docker/apache2/000-default.conf /etc/apache2/sites-enabled/000-default.conf

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# Launch Apache
CMD /wait && /usr/sbin/apache2ctl -DFOREGROUND
FROM nuxeo:10.10

# Distribution options: Default is dev (unstable) or a specific version in the format 3.3.0(-RC)
ARG DIST_VERSION=dev

COPY nuxeo.conf /docker-entrypoint-initnuxeo.d/nuxeo.conf
COPY setup.sh /docker-entrypoint-initnuxeo.d/setup.sh

USER root

# Setup some software

RUN echo "deb http://httpredir.debian.org/debian jessie non-free" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends nano

# Add prebuilt version of marketplace package
ADD https://s3.ca-central-1.amazonaws.com/firstvoices.com/dist/core/${DIST_VERSION}/FirstVoices-marketplace-package-latest.zip /opt/nuxeo/server/tmp/ 

# No need to start Nuxeo here - will happen automatically.

#USER 1000
COPY initialsetup.sh /opt/nuxeo/server/tmp/
RUN ["chmod", "+x", "/opt/nuxeo/server/tmp/initialsetup.sh"]
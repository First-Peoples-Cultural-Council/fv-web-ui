FROM nuxeo:10.10
MAINTAINER FPCC <support@fpcc.ca>

COPY nuxeo.conf /docker-entrypoint-initnuxeo.d/nuxeo.conf
COPY setup.sh /docker-entrypoint-initnuxeo.d/setup.sh

USER root

# Setup some software

RUN echo "deb http://httpredir.debian.org/debian jessie non-free" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends nano

# No need to start Nuxeo here - will happen automatically.

#USER 1000
COPY initialsetup.sh /opt/nuxeo/server/tmp/
RUN ["chmod", "+x", "/opt/nuxeo/server/tmp/initialsetup.sh"]
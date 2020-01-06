#!/bin/sh
nuxeoctl mp-install --accept=yes /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-latest.zip
touch /opt/nuxeo/server/nxserver/tmp/this.folder.is.mounted.in.docker.container

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
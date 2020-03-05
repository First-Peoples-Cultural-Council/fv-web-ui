#!/bin/sh
nuxeoctl mp-install --accept=yes /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-latest.zip
touch /opt/nuxeo/server/nxserver/tmp/this.folder.is.mounted.in.docker.container

# This will exec the CMD from your Dockerfile, i.e. "npm start"

# Startup a process in the background which checks for the server startup
 # every ten seconds and runs the initial setup script if it has started.
(
    STARTED=0
    while [[ $STARTED -ne 1 ]]
    do
        if [[ $(nuxeoctl status) =~ Server[[:space:]]is[[:space:]]running[[:space:]]with[[:space:]]process[[:space:]]ID ]]; then
            STARTED=1
        fi
        sleep 20
    done
    /opt/nuxeo/server/tmp/initialsetup.sh; exit 0
) & disown

# Startup the backend
exec "$@"
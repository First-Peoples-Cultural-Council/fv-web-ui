#!/bin/sh

PREBUILT_ZIP=/opt/nuxeo/server/tmp/firstvoices-marketplace-package-latest.zip

nuxeoctl mp-install --accept=yes /opt/nuxeo/server/tmp/firstvoices-marketplace-package-latest.zip

# Startup a process in the background which checks for the server startup
 # every ten seconds and runs the initial setup script if it has started.
(
    STARTED=0
    while [[ $STARTED -ne 1 ]]
    do
        sleep 5
        if [[ $(nuxeoctl status) =~ Server[[:space:]]is[[:space:]]running[[:space:]]with[[:space:]]process[[:space:]]ID ]]; then
            STARTED=1
        fi
    done
    sleep 15; /opt/nuxeo/server/tmp/initialsetup.sh; exit 0
) & disown

# Startup the backend
exec "$@"

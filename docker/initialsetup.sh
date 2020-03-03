#!/bin/bash

#
# Run this once, after you have started your docker container, to setup the First Voices backend.
#
TARGET="$1"
if [ -z "$1" ]; then
    echo "No target url found. Using the default http://127.0.0.1:8080"
    TARGET="http://127.0.0.1:8080"
else
    TARGET="http://$1:8080"
    echo "Target: " $TARGET
fi

echo ''
if [[ -z "$CYPRESS_FV_USERNAME" || -z "$CYPRESS_FV_PASSWORD" ]]; then
    echo "No CYPRESS_FV_USERNAME and/or no CYPRESS_FV_PASSWORD environment variables were found."
    echo "Skipping the creation of an adminstrator account (you can use the default Administrator Administrator account for now)."
else
    echo "Environment variables found for the creation of an admin account."
fi
echo ''

echo "Sending initial database setup request"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.InitialDatabaseSetup' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"context":{}}' -u Administrator:Administrator)
if [[ "response" -ne 200 && "response" -ne 204 ]]; then
    echo -e 'Initial database setup failed: Error ' ${response} ' \n'; exit 1
    echo
fi
echo
echo '--------------------------------------'
echo 'Database setup completed successfully.'
echo '--------------------------------------'
exit 0
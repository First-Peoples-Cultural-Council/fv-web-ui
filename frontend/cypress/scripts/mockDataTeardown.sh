#!/bin/bash

# This script is used exclusively to teardown the test languages prior to running the Cypress tests.
# To use the script ensure the correct username and password environment variables are set for
# $CYPRESS_FV_USERNAME and $CYPRESS_FV_PASSWORD .
# Example usage: "bash ./TestDatabaseTeardown.sh http://127.0.0.1:8080 -keep"

DIRECTORY=$PWD
echo "$DIRECTORY"

if [ -z "$1" ]; then
    echo "Error: No target url found. Please run the command again with a url specified."
    echo "Example: \"bash ./TestDatabaseTeardown.sh http://127.0.0.1:8080\""
    echo
    exit 1
fi
# Safeguard against running on production
if [ "$1" == "https://www.firstvoices.com" ]; then
    echo "Error: NEVER run this on production."
    echo
    exit 1
fi

TARGET="$1"
#TARGET="http://127.0.0.1:8080"
#TARGET="https://dev.firstvoices.com"
echo "Target URL found: " $TARGET
echo
cd "$DIRECTORY" || return

echo "Removing Users"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.RemoveUsersForDialect' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
if [[ "$response" -ne 204 ]]; then
  echo -e 'Mocks.RemoveUsersForDialect failed: Error ' "$response" ' \n'
  exit 1
  echo
fi
echo "Removing Dialects"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.RemoveDialects' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
if [[ "$response" -ne 204 ]]; then
  echo -e 'Mocks.RemoveDialects failed: Error ' "$response" ' \n'
  exit 1
  echo
fi

echo '-----------------------------------------'
echo 'Database teardown completed successfully.'
echo '-----------------------------------------'
exit 0

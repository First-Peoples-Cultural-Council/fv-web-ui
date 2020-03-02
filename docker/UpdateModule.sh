#!/bin/bash

DIRECTORY=$PWD
MODULE=$1

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

cd $DIRECTORY/../$1
ls
# Build main project.
echo 'Building module: ' $1
mvn clean install
if [[ "$?" -ne 0 ]]; then
    echo
    echo -e "${RED}fv-web-ui build failed \n${ENDCOLOR}"; exit 1
    echo
fi
echo ''

echo 'Removing old bundle from docker container if it exists.'
docker exec nuxeo-dev sh -c 'rm /opt/nuxeo/server/nxserver/bundles/$1-*.jar'
echo ''

echo 'Copying new bundle into docker container and restarting nuxeo backend.'
docker cp target/$1-*.jar nuxeo-dev:/opt/nuxeo/server/nxserver/bundles/ && docker exec nuxeo-dev nuxeoctl restart
if [[ "$?" -ne 0 ]]; then
    echo
    echo -e "${RED}Copy new bundle build into docker failed. \n${ENDCOLOR}"; exit 1
    echo
fi
echo ''

echo ''
echo -e "---------------------------------------------------------------"
echo -e "${GREEN}Module built and copied into the docker container successfully.${ENDCOLOR}"
echo -e "---------------------------------------------------------------"
exit 0
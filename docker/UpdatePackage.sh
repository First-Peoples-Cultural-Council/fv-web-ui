#!/bin/bash

# Set some colors for text formatting
RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

cd ../

# Build entire FirstVoices package.
echo 'Building entire package '
if [ "$1" == "-skip-tests" || "$2" == "-skip-tests" ]; then
    mvn -Dmaven.test.skip=true install -q
    if [[ "$?" -ne 0 ]]; then
        echo
        echo -e "${RED}fv-web-ui build failed \n${ENDCOLOR}"; exit 1
        echo
    fi
    echo ''
else
    mvn clean install
    if [[ "$?" -ne 0 ]]; then
        echo
        echo -e "${RED}fv-web-ui build failed \n${ENDCOLOR}"; exit 1
        echo
    fi
    echo ''
fi

echo 'Copying build package into shared docker volume.'
cp FirstVoices-marketplace/target/FirstVoices-marketplace-package-latest.zip docker/nuxeo_dev_docker

echo 'Installing new package and restarting server.'
docker exec nuxeo-dev /bin/bash -c "nuxeoctl stop && nuxeoctl mp-install --accept=yes /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-latest.zip && nuxeoctl start"

echo ''
echo -e "---------------------------------------------------------------"
echo -e "${GREEN}Package built and deployed to docker container successfully.${ENDCOLOR}"
echo -e "---------------------------------------------------------------"
exit 0

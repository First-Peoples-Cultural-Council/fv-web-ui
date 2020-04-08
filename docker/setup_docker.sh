#!/bin/bash

#
# Run this to setup everything docker needs to run the backend.
# Optionally add the --cypress or --frontend flags to include the building
# of the docker images for those components.
#

DIRECTORY=$PWD
echo ${DIRECTORY}

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

# Build the backend docker image
cd ${DIRECTORY}
echo 'Building backend Docker image'
docker build -t me/nuxeo-dev .
if [[ "$?" -ne 0 ]]; then
    echo
    echo -e "${RED}Docker backend build failed \n${ENDCOLOR}"; exit 1
    echo
fi
echo

if [ "$1" == "--frontend" ] || [ "$2" == "--frontend" ]; then
    # Build the frontend docker image
    cd ${DIRECTORY}/../
    echo 'Building frontend Docker image'
    docker build -t me/fv-web-ui .
    if [[ "$?" -ne 0 ]]; then
        echo
        echo -e "${RED}Docker frontend build failed \n${ENDCOLOR}"; exit 1
        echo
    fi
    echo
else
    echo 'Skipping the frontend docker image build'
fi

if [ "$1" == "--cypress" ] || [ "$2" == "--cypress" ]; then
    # Build the cypress docker image
    cd ${DIRECTORY}/../
    echo 'Building Cypress Docker image'
    docker build -f Dockerfile_cypress -t me/cypress .
    if [[ "$?" -ne 0 ]]; then
        echo
        echo -e "${RED}Docker frontend build failed \n${ENDCOLOR}"; exit 1
        echo
    fi
    echo
else
    echo 'Skipping the Cypress docker image build'
fi

cd ${DIRECTORY}
# Create the docker volume directories to hold the server logs / data
if [[ ! -d "$DIRECTORY/nuxeo_dev_docker" ]]; then
    echo 'Creating docker volume directories'
    mkdir ./nuxeo_dev_docker ./nuxeo_dev_docker/data ./nuxeo_dev_docker/logs
    if [[ "$?" -ne 0 ]]; then
        echo
        echo -e "${RED}Directory creation failed \n${ENDCOLOR}"; exit 1
        echo
    fi
fi
echo

# Build main project.
echo 'Building fv-web-ui (this make take a few minutes)'
cd ..
mvn clean install -Pbackend
if [[ "$?" -ne 0 ]]; then
    echo
    echo -e "${RED}fv-web-ui build failed \n${ENDCOLOR}"; exit 1
    echo
fi
echo

# Copy build zipfile to nuxeo_dev_docker folder
cd ${DIRECTORY}
echo 'Copying built zipfile to nuxeo_dev_docker'
cp ../FirstVoices-marketplace/target/FirstVoices-marketplace-package-latest.zip ./nuxeo_dev_docker/
if [[ "$?" -ne 0 ]]; then
    echo
    echo -e "${RED}Zipfile copy failed \n${ENDCOLOR}"; exit 1
    echo
fi
echo

echo
echo -e "--------------------------------------------------------------------------------------"
echo -e "${GREEN}Setup completed successfully. Docker is setup and ready to run."
echo -e "Please refer to the README on how to use the docker run command to startup the backend.${ENDCOLOR}"
echo -e "--------------------------------------------------------------------------------------"
exit 0
#!/bin/bash

#
# Run this to setup everything docker needs to run the backend.
# Optionally add the --cypress or --frontend flags to include the building
# of the docker images for those components.
#

#
# This setup script exists as a convenient way to get your development environment setup.
# If you wish to get more control over this process, you can execute this commands seperately, for example:
# 
# * Build this image locally using `docker build -t me/nuxeo-dev .`
# * Build the fv-web-ui project manually (`mvn clean install` in `fv-web-ui`, then deploy the ZIP file to the docker server)
# * Mount directories yourself via docker.
# 
# For more information, read more about Docker's capabilities here: https://www.docker.com/
# 

DIRECTORY=$PWD
echo ${DIRECTORY}

DIST_VERSION=

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

if [[ "$1" =~ --dist=[0-9].[0-9].[0-9](\-RC|$) ]]; then
    if [[ ${1:13:2} == "RC" ]]; then
        DIST_VERSION=${1:7:8}
    else
        DIST_VERSION=${1:7:5}
    fi
fi

# Build the backend docker image
cd ${DIRECTORY}
if [[ -z "$DIST_VERSION" ]]; then
    docker build -t me/nuxeo-dev .
else
    echo -e "Building backend Docker image (using binary version $DIST_VERSION)"
    echo 
    docker build --no-cache -t me/nuxeo-dev --build-arg DIST_VERSION=$DIST_VERSION .
fi

if [[ "$?" -ne 0 ]]; then
    echo
    echo -e "${RED}Docker backend build failed \n${ENDCOLOR}"; exit 1
    echo
fi
echo

if [ "$1" == "--frontend" ] || [ "$2" == "--frontend" ] || [ "$3" == "--frontend" ]; then
    # Build the frontend docker image
    cd ${DIRECTORY}/../
    echo 'Building frontend Docker image'

    if [[ -z "$DIST_VERSION" ]]; then
        echo 'Building backend Docker image (using latest binary version)'
        docker build --no-cache -t me/fv-web-ui .
    else
        echo -e "Building backend Docker image (using binary version $DIST_VERSION)"
        docker build --no-cache -t me/fv-web-ui --build-arg DIST_VERSION=$DIST_VERSION .
    fi

    if [[ "$?" -ne 0 ]]; then
        echo
        echo -e "${RED}Docker frontend build failed \n${ENDCOLOR}"; exit 1
        echo
    fi
    echo
else
    echo 'Skipping the frontend docker image build'
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

echo
echo -e "--------------------------------------------------------------------------------------"
echo -e "${GREEN}Setup completed successfully. Docker is setup and ready to run."
echo -e "Please refer to the README on how to use a docker command to startup the backend.${ENDCOLOR}"
echo -e "--------------------------------------------------------------------------------------"
exit 0
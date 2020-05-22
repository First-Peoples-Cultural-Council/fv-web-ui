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

# Build the frontend docker image
cd ${DIRECTORY}/../
echo 'Building frontend Docker image'
docker build -t me/fv-web-ui .
if [[ "$?" -ne 0 ]]; then
    echo
    echo -e "${RED}Docker frontend build failed \n${ENDCOLOR}"; exit 1
    echo
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

#docker-compose -f docker-compose.yml -f docker-compose.full.yml up

echo
echo -e "--------------------------------------------------------------------------------------"
echo -e "${GREEN}Setup completed successfully. Docker is setup and ready to run."
echo -e "Please refer to the README on how to use a docker command to startup the environment.${ENDCOLOR}"
echo -e "--------------------------------------------------------------------------------------"
exit 0
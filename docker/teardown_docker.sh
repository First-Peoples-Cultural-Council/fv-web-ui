#!/bin/bash

LABEL="label=ca.firstvoices.group=local_docker"

## List containers
echo -e "The following containers are within group 'local_docker':"
echo
docker ps -q -a --filter $LABEL
echo

## Stop containers
echo -e "Stopping all containers within group 'local_docker':"
echo
docker stop $(docker ps -q -a --filter $LABEL)
echo

## Remove containers
echo -e "Removing containers within group 'local_docker':"
docker rm -f $(docker ps -q -a --filter $LABEL)
echo

## Remove images (Note this generally should not be needed)
echo -e "Removing all images"
docker rmi -f $(docker images -a -q)
echo

## Remove volumes
echo -e "Removing all volumes:"
docker volume rm $(docker volume ls -q)
echo

## Remove network configuration
echo -e "Removing all network configuration:"
docker network rm $(docker network ls | tail -n+2 | awk '{if($2 !~ /bridge|none|host/){ print $1 }}')
echo

## Remove data directory
echo -e "Removing data directory:"
rm -r nuxeo_dev_docker
echo

echo
echo -e "--------------------------------------------------------------------------------------"
echo -e "${GREEN}Docker tear down completed successfully."
echo -e "--------------------------------------------------------------------------------------"
exit 0
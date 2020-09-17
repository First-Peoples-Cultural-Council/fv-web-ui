#!/bin/bash

# Get the path to this script
DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Pull the current module from the path
MODULE=${DIRECTORY##*/}

# Run the main UpdateModule script in the docker directory
cd $DIRECTORY
if [[ "$1" == "-skip-tests" ]]; then
    ../docker/UpdateModuleMain.sh $MODULE $1
else
    ../docker/UpdateModuleMain.sh $MODULE
fi
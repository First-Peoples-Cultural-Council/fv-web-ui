#!/bin/bash

# Get the path to this script
DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Pull the current module from the path
MODULE=${DIRECTORY##*/}

# Run the main UpdateModule script in the docker directory
cd $DIRECTORY
../docker/UpdateModuleMain.sh $MODULE
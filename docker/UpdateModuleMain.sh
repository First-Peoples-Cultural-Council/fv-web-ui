#!/bin/bash

# Get the path to this script and the module to be updated
DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
MODULE=$1

# Set some colors for text formatting
RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

cd $DIRECTORY/../modules/$MODULE

# Check to make sure a module name is passed in
if [[ -z $MODULE ]]; then
    echo -e "${RED}No input module found. Please run this command with the name of the module you want to update (eg: \"./UpdateModuleMain.sh FirstVoicesData\" \n${ENDCOLOR}"; exit 1
fi

# Build main module.
echo 'Building module: ' $MODULE
if [ "$2" == "-skip-tests" ]; then
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

JAR_FILE=$(find target -name "*.jar" ! -name "*-tests.jar" -exec basename \{} . \;)
CURRENT_VERSION=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.version -q -DforceStdout)
echo "Module has been built: $JAR_FILE with version $CURRENT_VERSION"

JAR_FILE_WITHOUT_VERSION="$JAR_FILE"
JAR_FILE_WITHOUT_VERSION=${JAR_FILE_WITHOUT_VERSION/$CURRENT_VERSION/*}

# Remove any old modules from the docker container if they exists
echo "Removing old module from docker container if it exists (matching $JAR_FILE_WITHOUT_VERSION)."
docker exec nuxeo-dev sh -c "rm /opt/nuxeo/server/nxserver/bundles/$JAR_FILE_WITHOUT_VERSION" > /dev/null 2>&1
echo ''

# Copy the new/updated module into the docker container and restart the nuxeo backend
echo 'Copying new module into docker container and restarting nuxeo backend.'
docker cp target/$JAR_FILE nuxeo-dev:/opt/nuxeo/server/nxserver/bundles/
docker exec nuxeo-dev sh -c "chown root:root /opt/nuxeo/server/nxserver/bundles/$JAR_FILE" > /dev/null 2>&1
docker exec nuxeo-dev nuxeoctl restart
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
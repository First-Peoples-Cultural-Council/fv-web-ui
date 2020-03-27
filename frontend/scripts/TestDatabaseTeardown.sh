#!/bin/bash

# This script is used exclusively to teardown the test languages prior to running the Cypress tests.
# To use the script ensure the correct username and password environment variables are set for
# $CYPRESS_FV_USERNAME and $CYPRESS_FV_PASSWORD . Optionally use the -skip-clone flag
# to bypass the cloning of fv-utils and fv-batch-import if they have already been cloned and to
# skip building the jar files for fv-utils and fv-batch-import.
# Example usage: "bash ./TestDatabaseTeardown.sh http://127.0.0.1:8080 -skip-clone"

DIRECTORY=$PWD
echo $DIRECTORY

if [ -z "$1" ] || [ "$1" == "-skip-clone" ]; then
    echo "Error: No target url found. Please run the command again with a url specified."
    echo "Example: \"bash ./TestDatabaseSetup.sh http://127.0.0.1:8080\""
    echo
    exit 1
fi

TARGET="$1"
#TARGET="http://127.0.0.1:8080"
#TARGET="https://dev.firstvoices.com"
echo "Target URL found: " $TARGET
echo

cd $DIRECTORY
# If "-skip-clone" parameter is supplied then don't do a fresh clone of fv-batch-import and fv-utils
# and skip building the jars.
if [ "$2" != "-skip-clone" ]; then

    # Delete old copies of fv-utils and fv-batch-import and clone fresh ones
    if [ -d "$DIRECTORY/temp/fv-utils-temp" ]; then
      echo "Removing old fv-utils"
      rm -rf $DIRECTORY/temp/fv-utils-temp
    fi
    if [ -d "$DIRECTORY/temp/fv-batch-import-temp" ]; then
      echo "Removing old fv-batch-import"
      rm -rf $DIRECTORY/temp/fv-batch-import-temp
    fi

    mkdir temp

    git clone https://github.com/First-Peoples-Cultural-Council/fv-batch-import.git ./temp/fv-batch-import-temp
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'git clone fv-batch-import failed \n'; exit 1
      echo
    fi
    git clone https://github.com/First-Peoples-Cultural-Council/fv-utils.git ./temp/fv-utils-temp
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'git clone fv-utils failed \n'; exit 1
      echo
    fi

    # Compile jar files from fv-utils and fv-batch-upload
    echo
    cd $DIRECTORY/temp/fv-utils-temp
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-utils build failed \n'; exit 1
      echo
    fi
    echo
    cd $DIRECTORY/temp/fv-batch-import-temp
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-batch-import build failed \n'; exit 1
      echo
    fi
fi
echo

cd $DIRECTORY/temp/fv-utils-temp/target/
# Delete existing TestLanguageOne directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageOne teardown failed \n'; exit 1
  echo
fi
echo

# Delete existing TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo teardown failed \n'; exit 1
  echo
fi
echo

# Delete existing TestLanguageThree directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageThree
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageThree teardown failed \n'; exit 1
  echo
fi
echo

# Delete existing TestLanguageFour directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageFour
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFour teardown failed \n'; exit 1
  echo
fi
echo

# Delete existing TestLanguageFive directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive teardown failed \n'; exit 1
  echo
fi

# Delete existing TestLanguageSix directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageSix
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageSix teardown failed \n'; exit 1
  echo
fi

# Delete existing TestLanguageSeven directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageSeven
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageSeven teardown failed \n'; exit 1
  echo
fi

echo
# Delete shared category
echo "Deleting TestLanguageSix category"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST 'http://127.0.0.1:8080/nuxeo/site/automation/Document.Delete' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/SharedData/Shared Categories/TestCategory","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 204 ]]; then
    echo -e 'TestLanguageSix category removal failed: Error ' $response ' \n'; exit 1
    echo
fi

echo

# Check if the Test/Test directory is empty and if so then delete it
content=$(curl -s -w "\n%{response_code}" -X POST ${TARGET}'/nuxeo/site/automation/Document.GetChildren' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
# Splits the get children response into a return code and a body
content=(${content[@]})
returnCode=${content[1]}
if [[ "$returnCode" -ne 200 ]]; then
    echo -e 'Get children of FV/Workspaces/Data/Test/Test/ failed: Error ' $returnCode ' \n'; exit 1
    echo
fi
# Filters out the body to the entries section
content=$(echo $content | grep -o "\"entries\":\[.*\]")
# If the entries section of the body is empty then delete the directory
if [[ ${content} == "\"entries\":[]" ]]; then
    echo
    echo "Deleting Test/Test directory"
    response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Delete' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "response" -ne 204 ]]; then
        echo -e 'Test/Test directory deletion failed: Error ' $response ' \n'; exit 1
        echo
    fi
fi

echo
echo '-----------------------------------------'
echo 'Database teardown completed successfully.'
echo '-----------------------------------------'
exit 0

#!/bin/bash

# This script is used exclusively to setup the test languages prior to running the Cypress tests.
# To use the script ensure the correct username and password environment variables are set for
# $CYPRESS_FV_USERNAME and $CYPRESS_FV_PASSWORD . Optionally use the -skip-clone flag
# to bypass the cloning of fv-utils and fv-batch-import if they have already been cloned and to
# skip building the jar files for fv-utils and fv-batch-import.
# Example usage: "bash ./TestDatabaseSetup.sh http://127.0.0.1:8080 -skip-clone"

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
    if [ -d "$DIRECTORY/fv-utils" ]; then
      echo "Removing old fv-utils"
      rm -rf $DIRECTORY/fv-utils
    fi
    if [ -d "$DIRECTORY/fv-batch-import" ]; then
      echo "Removing old fv-batch-import"
      rm -rf $DIRECTORY/fv-batch-import
    fi

    git clone https://github.com/First-Peoples-Cultural-Council/fv-batch-import.git
    git clone https://github.com/First-Peoples-Cultural-Council/fv-utils.git

    # Compile jar files from fv-utils and fv-batch-upload
    echo
    cd $DIRECTORY/fv-utils
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-utils build failed \n'; exit 1
      echo
    fi
    echo
    cd $DIRECTORY/fv-batch-import
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-batch-import build failed \n'; exit 1
      echo
    fi
fi
echo

# Check for FV/Workspaces/Data/TEst directory and create it if it doesn't exist
echo "Checking if TEst directory exists"
TEst_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "TEst_exists" -eq 404 ]]; then
    echo
    echo "Creating TEst FVLanguageFamily directory"
    response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVLanguageFamily","name":"TEst","properties":"dc:title=TEst"},"input":"/FV/Workspaces/Data","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "response" -ne 200 ]]; then
        echo -e 'TEst FVLanguageFamily creation failed: Error ' $response ' \n'; exit 1
        echo
    fi
else
    echo "TEst directory found"
fi
echo

# Check for FV/Workspaces/Data/TEst/Test directory and create it if it doesn't exist
echo "Checking if Test directory exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
    echo
    echo "Creating Test FVLanguage directory"
    response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVLanguage","name":"Test","properties":"dc:title=Test"},"input":"/FV/Workspaces/Data/TEst","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "response" -ne 200 ]]; then
        echo -e 'Test FVLanguage creation failed: Error ' $response ' \n'; exit 1
        echo
    fi
else
    echo "Test directory found"
fi
echo

cd $DIRECTORY/fv-utils/target/
# Create a fresh TestLanguageOne directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageOne creation failed \n'; exit 1
  echo
fi
echo

# Create a fresh TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo creation failed \n'; exit 1
  echo
fi
# Publish the language TestLanguageTwo
echo "Publishing language TestLanguageTwo"
responseOne=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/javascript.FVPublishOrRepublish' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageTwo","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$responseOne" -ne 200 ]]; then
    echo -e 'TestLanguageTwo publish failed: Error ' $responseOne ' \n'; exit 1
    echo
fi
# Import Word using fv-batch-import
cd $DIRECTORY/fv-batch-import/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangTwoWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageTwo Words batch failed \n'; exit 1
  echo
fi
# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangTwoPhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageTwo Phrases batch failed \n'; exit 1
  echo
fi
echo

cd $DIRECTORY/fv-utils/target/
# Create a fresh TestLanguageThree directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageThree
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageThree creation failed \n'; exit 1
  echo
fi
echo

# Create a fresh TestLanguageFour directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFour
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFour creation failed \n'; exit 1
  echo
fi
# Publish the language TestLanguageFour
echo "Publishing language TestLanguageFour"
responseThree=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/javascript.FVPublishOrRepublish' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageFour","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$responseThree" -ne 200 ]]; then
    echo -e 'TestLanguageFour publish failed: Error ' $responseThree ' \n'; exit 1
    echo
fi
echo

# Create a fresh TestLanguageFive directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive creation failed \n'; exit 1
  echo
fi
# Publish the language TestLanguageFive
echo "Publishing language TestLanguageFive"
responseTwo=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/javascript.FVPublishOrRepublish' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageFive","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$responseTwo" -ne 200 ]]; then
    echo -e 'TestLanguageFive publish failed: Error ' $responseTwo ' \n'; exit 1
    echo
fi
# Import Word using fv-batch-import
cd $DIRECTORY/fv-batch-import/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFiveWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Words batch failed \n'; exit 1
  echo
fi
# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFivePhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Phrases batch failed \n'; exit 1
  echo
fi
echo

# Remove generated batch files
cd $DIRECTORY/scripts/files/
count='find *_errors.csv | wc -l'
if [[ $count != 0 ]]; then
    echo "Removing generated batch files"
    rm *_errors.csv
    echo
fi

echo
echo '--------------------------------------'
echo 'Database setup completed successfully.'
echo '--------------------------------------'
exit 0

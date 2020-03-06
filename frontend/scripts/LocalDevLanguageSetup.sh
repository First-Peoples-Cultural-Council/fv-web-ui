#!/bin/bash

DIRECTORY=$PWD
echo $DIRECTORY

TARGET="http://127.0.0.1:8080"

# If "-skip-clone" parameter is supplied then don't do a fresh clone of fv-batch-import and fv-utils
# and skip building the jars.
if [ "$1" != "-skip-clone" ]; then

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


# Check for FV/Workspaces/Data/Test directory and create it if it doesn't exist
echo "Checking if Test directory exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
    echo
    echo "Creating Test FVLanguageFamily directory"
    response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVLanguageFamily","name":"Test","properties":"dc:title=Test"},"input":"/FV/Workspaces/Data","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "response" -ne 200 ]]; then
        echo -e 'Test FVLanguageFamily creation failed: Error ' $response ' \n'; exit 1
        echo
    fi
else
    echo "Test directory found"
fi
echo


cd $DIRECTORY/temp/fv-utils-temp/target/
# Check for FV/Workspaces/Data/Test/Test directory and create it if it doesn't exist
echo "Checking if Test/Test directory exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
    echo
    echo "Creating Test/Test FVLanguage directory"
    response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVLanguage","name":"Test","properties":"dc:title=Test"},"input":"/FV/Workspaces/Data/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "response" -ne 200 ]]; then
        echo -e 'Test/Test FVLanguage creation failed: Error ' $response ' \n'; exit 1
        echo
    fi
else
    echo "Test/Test directory found"
fi
echo


# Create a fresh DevLangOne directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name DevLangOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils DevLangOne creation failed \n'; exit 1
  echo
fi
echo


# Import Word using fv-batch-import
cd $DIRECTORY/temp/fv-batch-import-temp/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/DevLangOneWords.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/DevLangOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import DevLangOne Words batch failed \n'; exit 1
  echo
fi


# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/DevLangOnePhrases.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/DevLangOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import DevLangOne Phrases batch failed \n'; exit 1
  echo
fi
echo


# Import Alphabet using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-alphabet.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/alphabet.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/DevLangOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import DevLangOne Alphabet batch failed \n'; exit 1
  echo
fi

# Remove generated batch files
cd $DIRECTORY/scripts/files/
count='find *_errors.csv | wc -l'
if [[ $count != 0 ]]; then
    echo "Removing generated batch files"
    rm *_errors.csv
    echo
fi

echo
echo '----------------------------------------'
echo 'DevLangOne setup completed successfully.'
echo '----------------------------------------'
exit 0
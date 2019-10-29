#!/bin/bash

# This script is used by individual Cypress tests to reset only the dictionary for
# the testing language "TestLanguageFive" so that it can be reused.

DIRECTORY=$PWD
echo $DIRECTORY

# Delete existing Dictionary directory and all files
cd $DIRECTORY/fv-utils/target
java -jar fv-nuxeo-utils-*.jar clear-words -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive dictionary clear failed \n'; exit 1
  echo
fi
# Publish the fresh dictionary to match the language
echo "Publishing dictionary"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST 'https://dev.firstvoices.com/nuxeo/site/automation/FVPublish' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageFive/Dictionary","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
    echo -e 'TestLanguageFive dictionary publish failed \n'; exit $response
    echo
fi

# Import Word using fv-batch-import
cd $DIRECTORY/fv-batch-import/target
java -jar fv-batch-import-*.jar -url "https://dev.firstvoices.com/nuxeo/" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFiveWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Words batch failed \n'; exit 1
  echo
fi
# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "https://dev.firstvoices.com/nuxeo/" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFivePhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Phrases batch failed \n'; exit 1
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

# If the parameter "enabled-true" is found then send a CURL request to enable the word
if [[ $1 == 'enabled-true' ]]; then
    echo "Enabling word"
    responseOne=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST 'https://dev.firstvoices.com/nuxeo/site/automation/FVEnableDocument' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageFive/Dictionary/TestWord","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "$responseOne" -ne 200 ]]; then
        echo -e 'TestLanguageFive word enable failed \n'; exit $responseOne
    echo
fi
    echo
fi
# If the parameter "enabled-true" is found then send a CURL request to enable the phrase
if [[ $1 == 'enabled-true' ]]; then
    echo "Enabling phrase"
    responseTwo=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST 'https://dev.firstvoices.com/nuxeo/site/automation/FVEnableDocument' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageFive/Dictionary/TestPhrase","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "$responseTwo" -ne 200 ]]; then
        echo -e 'TestLanguageFive phrase enable failed \n'; exit $responseTwo
    echo
fi
    echo
fi

echo
echo '-----------------------------------------------'
echo 'Reset TestLanguageFive dictionary successfully.'
echo '-----------------------------------------------'
exit 0

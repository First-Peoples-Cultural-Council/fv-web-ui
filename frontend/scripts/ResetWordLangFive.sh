#!/bin/bash
DIRECTORY=/$PWD/../
echo $DIRECTORY

# Delete existing Dictionary directory and all files
cd $DIRECTORY/fv-utils/target
java -jar fv-nuxeo-utils-*.jar clear-words -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive dictionary clear failed \n'; exit $rc
  echo
fi

# Import Word using fv-batch-import
cd $DIRECTORY/fv-batch-import/target
java -jar fv-batch-import-*.jar -url "https://dev.firstvoices.com/nuxeo/" -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFiveWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Words batch failed \n'; exit $rc
  echo
fi
# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "https://dev.firstvoices.com/nuxeo/" -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFivePhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Phrases batch failed \n'; exit $rc
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
    curl -s -X POST 'https://dev.firstvoices.com/nuxeo/site/automation/FVEnableDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageFive/Dictionary/TestWord","context":{}}' -u $CYPRESS_FPCCAdmin_USERNAME:$CYPRESS_FPCCAdmin_PASSWORD > /dev/null
    echo
fi

echo
echo '-----------------------------------------------'
echo 'Reset TestLanguageFive dictionary successfully.'
echo '-----------------------------------------------'
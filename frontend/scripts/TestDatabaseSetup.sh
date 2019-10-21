#!/bin/bash
DIRECTORY=$PWD
echo $DIRECTORY

cd $DIRECTORY
# If "-skip-clone" parameter is supplied then don't do a fresh clone of fv-batch-import and fv-utils
if [ "$1" != "-skip-clone" ]; then

    # Delete old copies of fv-utils and fv-batch-import and clone fresh ones
    if [ -d "$DIRECTORY/fv-utils" ]; then
      echo "Removing old fv-utils"
      rm -rf $DIRECTORY/fv-utils
    fi
    if [ -d "$DIRECTORY/fv-batch-import" ]; then
      echo "Removing old fv--batch-import"
      rm -rf $DIRECTORY/fv-batch-import
    fi

    git clone https://github.com/First-Peoples-Cultural-Council/fv-batch-import.git
    git clone https://github.com/First-Peoples-Cultural-Council/fv-utils.git

fi

# Compile jar files from fv-utils and fv-batch-upload
echo
cd $DIRECTORY/fv-utils
mvn clean install
# Check that the return code is zero
if [[ "$?" -ne 0 ]]; then
  echo
  echo -e 'fv-utils build failed \n'; exit $rc
  echo
fi
echo
cd $DIRECTORY/fv-batch-import
mvn clean install
# Check that the return code is zero
if [[ "$?" -ne 0 ]]; then
  echo
  echo -e 'fv-batch-import build failed \n'; exit $rc
  echo
fi

echo
cd $DIRECTORY/fv-utils/target/
# Delete existing TestLanguageOne directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageOne teardown failed \n'; exit $rc
  echo
fi
# Create a fresh TestLanguageOne directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageOne creation failed \n'; exit $rc
  echo
fi

# Delete existing TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo teardown failed \n'; exit $rc
  echo
fi
# Create a fresh TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo creation failed \n'; exit $rc
  echo
fi
# Import Word using fv-batch-import
cd $DIRECTORY/fv-batch-import/target
java -jar fv-batch-import-*.jar -url "https://dev.firstvoices.com/nuxeo/" -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangTwoWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageTwo Words batch failed \n'; exit $rc
  echo
fi
# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "https://dev.firstvoices.com/nuxeo/" -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangTwoPhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path TEst/Test/TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageTwo Phrases batch failed \n'; exit $rc
  echo
fi
# Publish the language TestLanguageTwo
echo "Enabling language"
response=$(curl -o /dev/null -s -w "%{http_code}\n" -X POST 'https://dev.firstvoices.com/nuxeo/site/automation/FVPublish' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/TEst/Test/TestLanguageTwo","context":{}}' -u $CYPRESS_FPCCAdmin_USERNAME:$CYPRESS_FPCCAdmin_PASSWORD)
if [[ "$response" -ne 200 ]]; then
    echo -e 'TestLanguageTwo publish failed \n'; exit $response
    echo
fi

cd $DIRECTORY/fv-utils/target/
# Delete existing TestLanguageThree directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageThree
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageThree teardown failed \n'; exit $rc
  echo
fi
# Create a fresh TestLanguageThree directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageThree
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageThree creation failed \n'; exit $rc
  echo
fi

# Delete existing TestLanguageFour directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFour
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFour teardown failed \n'; exit $rc
  echo
fi
# Create a fresh TestLanguageFour directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFour
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFour creation failed \n'; exit $rc
  echo
fi

# Delete existing TestLanguageFive directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive teardown failed \n'; exit $rc
  echo
fi
# Create a fresh TestLanguageFive directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive creation failed \n'; exit $rc
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

echo
echo '--------------------------------------'
echo 'Database setup completed successfully.'
echo '--------------------------------------'
exit 0

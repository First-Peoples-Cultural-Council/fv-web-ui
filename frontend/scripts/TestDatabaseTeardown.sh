#!/bin/bash

# This script is used exclusively to teardown the test languages prior to running the Cypress tests.
# To use the script ensure the correct username and password environment variables are set for
# $CYPRESS_FV_USERNAME and $CYPRESS_FV_PASSWORD .

DIRECTORY=$PWD
echo $DIRECTORY

if [ -z "$1" ]; then
    echo "Error: No target url found. Please run the command again with a url specified."
    echo "Example: \"bash ./TestDatabaseSetup.sh http://127.0.0.1:8080\""
    echo
    exit 1
fi

TARGET="$1"
#TARGET="http://127.0.0.1:8080"
#TARGET="https://dev.firstvoices.com"
echo "Target URL found: " $TARGET

cd $DIRECTORY/fv-utils/target/
# Delete existing TestLanguageOne directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageOne teardown failed \n'; exit 1
  echo
fi

# Delete existing TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo teardown failed \n'; exit 1
  echo
fi

# Delete existing TestLanguageThree directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageThree
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageThree teardown failed \n'; exit 1
  echo
fi

# Delete existing TestLanguageFour directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFour
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFour teardown failed \n'; exit 1
  echo
fi

# Delete existing TestLanguageFive directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory TEst/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive teardown failed \n'; exit 1
  echo
fi

echo
echo '-----------------------------------------'
echo 'Database teardown completed successfully.'
echo '-----------------------------------------'
exit 0

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
    echo -e 'git clone fv-batch-import failed \n'
    exit 1
    echo
  fi
  git clone https://github.com/First-Peoples-Cultural-Council/fv-utils.git ./temp/fv-utils-temp
  if [[ "$?" -ne 0 ]]; then
    echo
    echo -e 'git clone fv-utils failed \n'
    exit 1
    echo
  fi

  # Compile jar files from fv-utils and fv-batch-upload
  echo
  cd $DIRECTORY/temp/fv-utils-temp
  mvn clean install
  # Check that the return code is zero
  if [[ "$?" -ne 0 ]]; then
    echo
    echo -e 'fv-utils build failed \n'
    exit 1
    echo
  fi
  echo
  cd $DIRECTORY/temp/fv-batch-import-temp
  mvn clean install
  # Check that the return code is zero
  if [[ "$?" -ne 0 ]]; then
    echo
    echo -e 'fv-batch-import build failed \n'
    exit 1
    echo
  fi
fi
echo

# ----- TEST DIRECTORY SETUP ------
# Check for FV/Workspaces/Data/Test directory and create it if it doesn't exist
echo "Checking if Test directory exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
  echo
  echo "Creating Test FVLanguageFamily directory"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVLanguageFamily","name":"Test","properties":"dc:title=Test"},"input":"/FV/Workspaces/Data","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "response" -ne 200 ]]; then
    echo -e 'Test FVLanguageFamily creation failed: Error ' $response ' \n'
    exit 1
    echo
  fi
else
  echo "Test directory found"
fi
echo
# Check for FV/Workspaces/Data/Test/Test directory and create it if it doesn't exist
echo "Checking if Test/Test directory exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
  echo
  echo "Creating Test/Test FVLanguage directory"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVLanguage","name":"Test","properties":"dc:title=Test"},"input":"/FV/Workspaces/Data/Test","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "response" -ne 200 ]]; then
    echo -e 'Test/Test FVLanguage creation failed: Error ' $response ' \n'
    exit 1
    echo
  fi
else
  echo "Test/Test directory found"
fi
echo

# ----- TEST LANGUAGE ONE ------
cd $DIRECTORY/temp/fv-utils-temp/target/
# Create a fresh TestLanguageOne directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageOne creation failed \n'
  exit 1
  echo
fi
echo

# ----- TEST LANGUAGE TWO ------
# Create a fresh TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo creation failed \n'
  exit 1
  echo
fi
# Publish the language TestLanguageTwo
echo "Publishing language TestLanguageTwo"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageTwo","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageTwo publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Import Word using fv-batch-import
cd $DIRECTORY/temp/fv-batch-import-temp/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangTwoWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageTwo Words batch failed \n'
  exit 1
  echo
fi
# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangTwoPhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageTwo Phrases batch failed \n'
  exit 1
  echo
fi
echo

# ----- TEST LANGUAGE THREE ------
cd $DIRECTORY/temp/fv-utils-temp/target/
# Create a fresh TestLanguageThree directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageThree
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageThree creation failed \n'
  exit 1
  echo
fi
echo
# Publish the language TestLanguageThree
echo "Publishing language TestLanguageThree"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageThree","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageThree publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
echo

# ----- TEST LANGUAGE FOUR ------
# Create a fresh TestLanguageFour directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageFour
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFour creation failed \n'
  exit 1
  echo
fi
# Publish the language TestLanguageFour
echo "Publishing language TestLanguageFour"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageFour","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageFour publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
echo

# ----- TEST LANGUAGE FIVE ------
# Create a fresh TestLanguageFive directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageFive creation failed \n'
  exit 1
  echo
fi
# Publish the language TestLanguageFive
echo "Publishing language TestLanguageFive"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageFive","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageFive publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Import Word using fv-batch-import
cd $DIRECTORY/temp/fv-batch-import-temp/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFiveWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Words batch failed \n'
  exit 1
  echo
fi
# Import Phrase using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangFivePhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageFive
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageFive Phrases batch failed \n'
  exit 1
  echo
fi
echo

# ----- TEST LANGUAGE SIX ------
cd $DIRECTORY/temp/fv-utils-temp/target/
# Create a fresh TestLanguageSix directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageSix
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageSix creation failed \n'
  exit 1
  echo
fi
# Create a category to group the words
echo "Creating TestLanguageSix category"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVCategory","name":"TestCategory","properties":"dc:title=TestCategory"},"input":"/FV/Workspaces/SharedData/Shared Categories","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageSix category creation failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Publish the shared categories directory
echo "Publishing Shared Categories Directory for LanguageSix"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":"/FV/sections/SharedData","override":"true"},"input":"/FV/Workspaces/SharedData/Shared Categories","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageSix category publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Publish the category using PublishToSections
echo "Publishing a shared category for TestLanguageSix - PublishToSections"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":"/FV/sections/SharedData/Shared Categories","override":"true"},"input":"/FV/Workspaces/SharedData/Shared Categories/TestCategory","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageSix category publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Publish the category using FVPublish
echo "Publishing a shared category for TestLanguageSix category - FVPublish"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/FVPublish' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/sections/SharedData/Shared Categories/TestCategory","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageSix category publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Create a phrasebook to group the phrases
echo "Creating TestLanguageSix phrasebook"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVCategory","name":"TestPhraseBook","properties":"dc:title=TestPhraseBook"},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageSix/Phrase Books","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageSix phrasebook creation failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Publish the phrasebook
echo "Publishing TestLanguageSix phrasebook"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/FVPublish' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"stopDocumentType":"FVCategories"},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageSix/Phrase Books/TestPhraseBook","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageSix phrasebook publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Import Words using fv-batch-import
cd $DIRECTORY/temp/fv-batch-import-temp/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangSixWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSix
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageSix Words batch failed \n'
  exit 1
  echo
fi
# Import Phrases using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangSixPhrase.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSix
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageSix Phrases batch failed \n'
  exit 1
  echo
fi
# Import Alphabet using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-alphabet.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/alphabet.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSix
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageSix Alphabet batch failed \n'
  exit 1
  echo
fi
# Publish the language TestLanguageSix
echo "Publishing language TestLanguageSix"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageSix","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageSix publish failed: Error ' $response ' \n'
  exit 1
  echo
fi

# ----- TEST LANGUAGE SEVEN ------
cd $DIRECTORY/temp/fv-utils-temp/target/
# Create a fresh TestLanguageSeven directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageSeven
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageSeven creation failed \n'
  exit 1
  echo
fi
echo
# Import Alphabet using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-alphabet.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangSevenAlphabet.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSeven
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageSeven Alphabet batch failed \n'
  exit 1
  echo
fi
# Import Words using fv-batch-import
cd $DIRECTORY/temp/fv-batch-import-temp/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangSevenWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSeven
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageSeven Words batch failed \n'
  exit 1
  echo
fi

# ----- TEST LANGUAGE EIGHT ------
cd $DIRECTORY/temp/fv-utils-temp/target/
# Create a fresh TestLanguageEight directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageEight
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageEight creation failed \n'
  exit 1
  echo
fi
# Create a category to group the words
echo "Creating TestLanguageEight category: TestDialectCategory"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVCategory","name":"TestDialectCategory","properties":"dc:title=TestDialectCategory"},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageEight/Categories","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageEight category creation failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Publish the category
echo "Publishing TestLanguageEight category"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/FVPublishCategoryParents' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":"/FV/Workspaces/Data/Test/Test/TestLanguageEight/Categories","override":"true"},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageEight/Categories/TestDialectCategory","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageEight category publish failed: Error ' $response ' \n'
  exit 1
  echo
fi
# Import Words using fv-batch-import
cd $DIRECTORY/temp/fv-batch-import-temp/target
java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/testLangEightWord.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageEight
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageEight Words batch failed \n'
  exit 1
  echo
fi
# Import Alphabet using fv-batch-import
cd $DIRECTORY/scripts/batch_jarfiles/
java -jar fv-batch-import-alphabet.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file $DIRECTORY/scripts/files/alphabet.csv -data-path $DIRECTORY/scripts/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageEight
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import TestLanguageEight Alphabet batch failed \n'
  exit 1
  echo
fi
# Publish the language TestLanguageEight
echo "Publishing language TestLanguageEight"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageEight","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestLanguageEight publish failed: Error ' $response ' \n'
  exit 1
  echo
fi

# Publishing FV/Workspaces/Site/Resources for pages use
echo "Publishing Resources folder for pages use"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":["/FV/sections/Site"],"override":"false"},"input":"/FV/Workspaces/Site/Resources","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'Resources publish failed: Error ' $response ' \n'
  exit 1
  echo
fi

# Check for "FV/Workspaces/Site/Resources/Pages/Get Started" and create it if it doesn't exist
echo "Checking if \"Get Started\" page exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
  # Create "Get Started" menu page
  echo "Creating \"Get Started\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVPage","name":"Get Started","properties":{"dc:title":"Get Started","fvpage:blocks":[], "fvpage:url":"get-started"}},"input":"/FV/Workspaces/Site/Resources/Pages","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get started" page creation failed: Error ' $response ' \n'
    exit 1
    echo
  fi
  echo "Adding block property to \"Get Started\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.AddItemToListProperty' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"complexJsonProperties":"[{\"text\":\"What is FirstVoices.\",\"title\":\"Get Started\"}]","xpath":"fvpage:blocks","save":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get started" block property addition failed: Error ' $response ' \n'
    exit 1
    echo
  fi
  # Publish "Get Started" menu page
  echo "Publishing \"Get Started\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get Started" page publish failed: Error ' $response ' \n'
    exit 1
    echo
  fi
  # Publish to section
  echo "Publishing \"Get Started\" page to sections"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":["/FV/sections/Site/Resources"],"override":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get Started" page sections publish failed: Error ' $response ' \n'
    exit 1
    echo
  fi
else
  echo "\"Get Started\" page found"
fi
echo

# Check for "FV/Workspaces/Site/Resources/Pages/FirstVoices Apps" and create it if it doesn't exist
echo "Checking if \"FirstVoices Apps\" page exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
  # Create "FirstVoices Apps" menu page
  echo "Creating \"FirstVoices Apps\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVPage","name":"FirstVoices Apps","properties":{"dc:title":"FirstVoices Apps","fvpage:blocks":[], "fvpage:url":"apps"}},"input":"/FV/Workspaces/Site/Resources/Pages","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" page creation failed: Error ' $response ' \n'
    exit 1
    echo
  fi
  # Add content to page
  echo "Adding block property to \"FirstVoices Apps\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.AddItemToListProperty' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"complexJsonProperties":"[{\"text\":\"FirstVoices Apps.\",\"title\":\"FirstVoices Apps\"}]","xpath":"fvpage:blocks","save":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e 'FirstVoices Apps block property addition failed: Error ' $response ' \n'
    exit 1
    echo
  fi
  # Adding primary nav property = true to enable sidebar
  echo "Adding FirstVoices Apps to sidebar"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.SetProperty' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"xpath":"fvpage:primary_navigation","save":"true","value":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" add sidebar failed: Error ' $response ' \n'
    exit 1
    echo
  fi
  # Publish "FirstVoices Apps" menu page
  echo "Publishing \"FirstVoices Apps\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" page publish failed: Error ' $response ' \n'
    exit 1
    echo
  fi
  # Publish to sections
  echo "Publishing \"FirstVoices Apps\" page to sections"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":["/FV/sections/Site/Resources"],"override":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" page sections publish failed: Error ' $response ' \n'
    exit 1
    echo
  fi
else
  echo "\"FirstVoices Apps\" page found"
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

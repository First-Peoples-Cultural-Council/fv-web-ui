#!/bin/bash

#
# Run this once, after you have started your docker container, to setup the First Voices backend.
#
echo ''
echo "Running initial database setup."

TARGET="$1"
if [ -z "$1" ]; then
    echo "No target url found. Using the default http://127.0.0.1:8080"
    TARGET="http://127.0.0.1:8080"
else
    TARGET="http://$1:8080"
    echo "Target: " $TARGET
fi

if [[ -z "$CYPRESS_FV_USERNAME" || -z "$CYPRESS_FV_PASSWORD" ]]; then
    echo "No CYPRESS_FV_USERNAME and/or no CYPRESS_FV_PASSWORD environment variables were found."
    echo "Skipping the creation of an adminstrator account (you can use the default Administrator Administrator account for now)."
else
    echo "Environment variables found for the creation of an admin account."
fi

echo "Sending initial database setup request"
response=$(curl --max-time 120 --connect-timeout 120 -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.InitialDatabaseSetup' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"context":{}}' -u Administrator:Administrator) ; echo "Exit code: $?"
if [[ "response" -ne 200 && "response" -ne 204 ]]; then
    echo -e 'Initial database setup failed: Error ' ${response} ' \n'; exit 1
    echo
fi
echo
echo '--------------------------------------'
echo 'Database setup completed successfully.'
echo '--------------------------------------'

if [ "$START_WITH_DATA" = "cypress_fixtures" ]; then

    DIRECTORY=/opt/nuxeo/server/temp

    echo "Set to import data on startup. Proceeding to import data."

    wget -N -q https://s3.ca-central-1.amazonaws.com/firstvoices.com/dist/batch/dev/fv-batch-import-2.0.0.jar -P $DIRECTORY
    wget -N -q https://s3.ca-central-1.amazonaws.com/firstvoices.com/dist/utils/dev/fv-nuxeo-utils-1.0-SNAPSHOT.jar -P $DIRECTORY

    # Note: ALL of this should be moved into Nuxeo
    # i.e. an end-point that does this setup, perhaps as part of test module

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
    cd $DIRECTORY
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
    cd $DIRECTORY
    java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangTwoWord.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageTwo
    if [[ "$?" -ne 0 ]]; then
    echo -e 'fv-batch-import TestLanguageTwo Words batch failed \n'
    exit 1
    echo
    fi
    # # Import Phrase using fv-batch-import
    # cd /opt/fixtures/batch_jarfiles/
    # java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangTwoPhrase.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageTwo
    # if [[ "$?" -ne 0 ]]; then
    # echo -e 'fv-batch-import TestLanguageTwo Phrases batch failed \n'
    # exit 1
    # echo
    # fi
    # echo

    # ----- TEST LANGUAGE THREE ------
    cd $DIRECTORY
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
    cd $DIRECTORY
    java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangFiveWord.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageFive
    if [[ "$?" -ne 0 ]]; then
    echo -e 'fv-batch-import TestLanguageFive Words batch failed \n'
    exit 1
    echo
    fi
    # # Import Phrase using fv-batch-import
    # cd /opt/fixtures/batch_jarfiles/
    # java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangFivePhrase.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageFive
    # if [[ "$?" -ne 0 ]]; then
    # echo -e 'fv-batch-import TestLanguageFive Phrases batch failed \n'
    # exit 1
    # echo
    # fi
    # echo

    # ----- TEST LANGUAGE SIX ------
    cd $DIRECTORY
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
    cd $DIRECTORY
    java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangSixWord.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSix
    if [[ "$?" -ne 0 ]]; then
    echo -e 'fv-batch-import TestLanguageSix Words batch failed \n'
    exit 1
    echo
    fi
    # # Import Phrases using fv-batch-import
    # cd /opt/fixtures/batch_jarfiles/
    # java -jar fv-batch-import-phrases.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangSixPhrase.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSix
    # if [[ "$?" -ne 0 ]]; then
    # echo -e 'fv-batch-import TestLanguageSix Phrases batch failed \n'
    # exit 1
    # echo
    # fi
    # # Import Alphabet using fv-batch-import
    # cd /opt/fixtures/batch_jarfiles/
    # java -jar fv-batch-import-alphabet.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/alphabet.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSix
    # if [[ "$?" -ne 0 ]]; then
    # echo -e 'fv-batch-import TestLanguageSix Alphabet batch failed \n'
    # exit 1
    # echo
    # fi
    # Publish the language TestLanguageSix
    echo "Publishing language TestLanguageSix"
    response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestLanguageSix","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
    if [[ "$response" -ne 200 ]]; then
    echo -e 'TestLanguageSix publish failed: Error ' $response ' \n'
    exit 1
    echo
    fi

    # ----- TEST LANGUAGE SEVEN ------
    cd $DIRECTORY
    # Create a fresh TestLanguageSeven directory and all files
    java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name TestLanguageSeven
    if [[ "$?" -ne 0 ]]; then
    echo -e 'fv-utils TestLanguageSeven creation failed \n'
    exit 1
    echo
    fi
    echo
    # # Import Alphabet using fv-batch-import
    # cd /opt/fixtures/batch_jarfiles/
    # java -jar fv-batch-import-alphabet.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangSevenAlphabet.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSeven
    # if [[ "$?" -ne 0 ]]; then
    # echo -e 'fv-batch-import TestLanguageSeven Alphabet batch failed \n'
    # exit 1
    # echo
    # fi
    # Import Words using fv-batch-import
    cd $DIRECTORY
    java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangSevenWord.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageSeven
    if [[ "$?" -ne 0 ]]; then
    echo -e 'fv-batch-import TestLanguageSeven Words batch failed \n'
    exit 1
    echo
    fi

    # ----- TEST LANGUAGE EIGHT ------
    cd $DIRECTORY
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
    cd $DIRECTORY
    java -jar fv-batch-import-*.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/testLangEightWord.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageEight
    if [[ "$?" -ne 0 ]]; then
    echo -e 'fv-batch-import TestLanguageEight Words batch failed \n'
    exit 1
    echo
    fi
    # # Import Alphabet using fv-batch-import
    # cd /opt/fixtures/batch_jarfiles/
    # java -jar fv-batch-import-alphabet.jar -url "$TARGET/nuxeo" -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -domain FV -csv-file /opt/fixtures/files/alphabet.csv -data-path /opt/fixtures/files/testLangTwoMedia/ -dialect-id fillerID -language-path Test/Test/TestLanguageEight
    # if [[ "$?" -ne 0 ]]; then
    # echo -e 'fv-batch-import TestLanguageEight Alphabet batch failed \n'
    # exit 1
    # echo
    # fi
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

fi

echo
echo '--------------------------------------'
echo 'Import complete.'
echo '--------------------------------------'

exit 0
#!/bin/bash

# This script is used exclusively to setup the test languages prior to running the Cypress tests.
# To use the script ensure the correct username and password environment variables are set for
# $CYPRESS_FV_USERNAME and $CYPRESS_FV_PASSWORD .
# Example usage: "bash ./TestDatabaseSetup.sh http://127.0.0.1:8080 -skip-clone"

if [ -z "$1" ]; then
  echo "Error: No target url found. Please run the command again with a url specified."
  echo "Example: \"bash ./TestDatabaseSetup.sh http://127.0.0.1:8080\""
  echo
  exit 1
fi

TARGET="$1"
#TARGET="http://127.0.0.1:8080"
#TARGET="https://dev.firstvoices.com"
echo "Target URL found: " "$TARGET"
echo
# ----- TEST DIALECT PRIVATE ------
echo "Creating a fresh TestDialectPrivate directory and all files"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.GenerateDialect' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"randomize":"false","dialectName":"TestDialectPrivate","maxEntries":"30"},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestDialectPrivate creation failed \n'
  exit 1
fi
# Enable the language TestDialectPrivate
echo "Enable TestDialectPrivate"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 10' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Data/Test/Test/TestDialectPrivate","context":{"value": "Enable"}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestDialectPrivate enable failed: Error ' "$response" ' \n'
  exit 1
fi
echo
# ----- TEST DIALECT PUBLIC ------
echo "Creating a fresh TestDialectPublic directory and all files"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.GenerateDialect' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"randomize":"false","dialectName":"TestDialectPublic","maxEntries":"30"},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
if [[ "$response" -ne 200 ]]; then
  echo -e 'TestDialectPublic creation failed \n'
  exit 1
fi
# Publish the language TestDialectPublic
echo "Publishing language TestDialectPublic"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Publishing.PublishDialect' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"batchSize": "1000", "phase": "work"},"input":"/FV/Workspaces/Data/Test/Test/TestDialectPublic","context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
if [[ "$response" -ne 204 ]]; then
  echo -e 'TestDialectPublic publish failed: Error ' "$response" ' \n'
  exit 1
fi
echo
# ----- GENERATE USERS ------
echo "Generating Users for all dialects"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.GenerateUsers' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
if [[ "$response" -ne 204 ]]; then
  echo -e 'Generating Users failed \n'
  exit 1
fi
echo

# Publishing FV/Workspaces/Site/Resources for pages use
echo "Publishing Resources folder for pages use"
response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":["/FV/sections/Site"],"override":"false"},"input":"/FV/Workspaces/Site/Resources","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "$response" -ne 200 ]]; then
  echo -e 'Resources publish failed: Error ' "$response" ' \n'
  exit 1
fi
echo

# Check for "FV/Workspaces/Site/Resources/Pages/Get Started" and create it if it doesn't exist
echo "Checking if \"Get Started\" page exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
  # Create "Get Started" menu page
  echo "Creating \"Get Started\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVPage","name":"Get Started","properties":{"dc:title":"Get Started","fvpage:blocks":[], "fvpage:url":"get-started"}},"input":"/FV/Workspaces/Site/Resources/Pages","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get started" page creation failed: Error ' "$response" ' \n'
    exit 1
  fi
  echo "Adding block property to \"Get Started\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.AddItemToListProperty' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"complexJsonProperties":"[{\"text\":\"What is FirstVoices.\",\"title\":\"Get Started\"}]","xpath":"fvpage:blocks","save":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get started" block property addition failed: Error ' "$response" ' \n'
    exit 1
  fi
  # Publish "Get Started" menu page
  echo "Publishing \"Get Started\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get Started" page publish failed: Error ' "$response" ' \n'
    exit 1
  fi
  # Publish to section
  echo "Publishing \"Get Started\" page to sections"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":["/FV/sections/Site/Resources"],"override":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/Get Started","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"Get Started" page sections publish failed: Error ' "$response" ' \n'
    exit 1
  fi
else
  echo "\"Get Started\" page found"
fi
echo

# Check for "FV/Workspaces/Site/Resources/Pages/FirstVoices Apps" and create it if it doesn't exist
echo "Checking if \"FirstVoices Apps\" page exists"
Test_exists=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Proxy.GetSourceDocument' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
if [[ "Test_exists" -eq 404 ]]; then
  # Create "FirstVoices Apps" menu page
  echo "Creating \"FirstVoices Apps\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.Create' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"type":"FVPage","name":"FirstVoices Apps","properties":{"dc:title":"FirstVoices Apps","fvpage:blocks":[], "fvpage:url":"apps"}},"input":"/FV/Workspaces/Site/Resources/Pages","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" page creation failed: Error ' "$response" ' \n'
    exit 1
  fi
  # Add content to page
  echo "Adding block property to \"FirstVoices Apps\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.AddItemToListProperty' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"complexJsonProperties":"[{\"text\":\"FirstVoices Apps.\",\"title\":\"FirstVoices Apps\"}]","xpath":"fvpage:blocks","save":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e 'FirstVoices Apps block property addition failed: Error ' "$response" ' \n'
    exit 1
  fi
  # Adding primary nav property = true to enable sidebar
  echo "Adding FirstVoices Apps to sidebar"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.SetProperty' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"xpath":"fvpage:primary_navigation","save":"true","value":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" add sidebar failed: Error ' "$response" ' \n'
    exit 1
  fi
  echo
  # Publish "FirstVoices Apps" menu page
  echo "Publishing \"FirstVoices Apps\" page"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.FollowLifecycleTransition' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{"value": "Publish"}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" page publish failed: Error ' "$response" ' \n'
    exit 1
  fi
  # Publish to sections
  echo "Publishing \"FirstVoices Apps\" page to sections"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.PublishToSections' -H 'Nuxeo-Transaction-Timeout: 300' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"target":["/FV/sections/Site/Resources"],"override":"true"},"input":"/FV/Workspaces/Site/Resources/Pages/FirstVoices Apps","context":{}}' -u $CYPRESS_FV_USERNAME:$CYPRESS_FV_PASSWORD)
  if [[ "$response" -ne 200 ]]; then
    echo -e '"FirstVoices Apps" page sections publish failed: Error ' "$response" ' \n'
    exit 1
  fi
else
  echo "\"FirstVoices Apps\" page found"
fi
echo
echo '--------------------------------------'
echo 'Database setup completed successfully.'
echo '--------------------------------------'
exit 0

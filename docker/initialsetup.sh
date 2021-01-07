#!/bin/bash

#
# Run this once, after you have started your docker container, to setup the First Voices backend.
#
echo ''
echo "Running initial database setup."

URL="$1"
PORT="$2"
PROTOCOL="$3"

if [ -z "$3" ]; then
  echo "No protocol specified. Using default http"
  PROTOCOL="http"
fi

if [ -z "$2" ]; then
  echo "No port found. Using default 8080"
  PORT="8080"
fi

if [ -z "$1" ]; then
  echo "No target url found. Using the default $PROTOCOL://127.0.0.1:$PORT"
  TARGET="$PROTOCOL://127.0.0.1:$PORT"
else
  TARGET="$PROTOCOL://$URL:$PORT"
fi

echo "Target: $TARGET"

if [[ -z "$CYPRESS_FV_USERNAME" || -z "$CYPRESS_FV_PASSWORD" ]]; then
  echo "No CYPRESS_FV_USERNAME and/or no CYPRESS_FV_PASSWORD environment variables were found."
  echo "Skipping the creation of an administrator account (you can use the default Administrator Administrator account for now)."
else
  echo "Environment variables found for the creation of an admin account."
fi

echo "Sending initial database setup request"
response=$(curl --max-time 120 --connect-timeout 120 -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Document.InitialDatabaseSetup' -H 'Nuxeo-Transaction-Timeout: 3' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"context":{}}' -u Administrator:Administrator)
echo "Exit code: $?"
if [[ "response" -ne 200 && "response" -ne 204 ]]; then
  echo -e 'Initial database setup failed: Error ' ${response} ' \n'
  exit 1
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

  # ----- TEST DIALECT PRIVATE ------
  echo "Creating a fresh TestDialectPrivate directory and all files"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.GenerateDialect' -H 'Nuxeo-Transaction-Timeout: 3000' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"randomize":"false","dialectName":"TestDialectPrivate","maxEntries":"30"},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
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
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.GenerateDialect' -H 'Nuxeo-Transaction-Timeout: 3000' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"randomize":"false","dialectName":"TestDialectPublic","maxEntries":"30"},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
  if [[ "$response" -ne 200 ]]; then
    echo -e 'TestDialectPublic creation failed \n'
    exit 1
  fi
  # Publish the language TestDialectPublic
  echo "Publishing language TestDialectPublic"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Publishing.PublishDialect' -H 'Nuxeo-Transaction-Timeout: 3000' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{"batchSize": "1000", "phase": "work"},"input":"/FV/Workspaces/Data/Test/Test/TestDialectPublic","context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
  if [[ "$response" -ne 204 ]]; then
    echo -e 'TestDialectPublic publish failed: Error ' "$response" ' \n'
    exit 1
  fi
  echo
  # ----- GENERATE USERS ------
  echo "Generating Users for all dialects"
  response=$(curl -o /dev/null -s -w "%{response_code}\n" -X POST ${TARGET}'/nuxeo/site/automation/Mocks.GenerateUsers' -H 'Nuxeo-Transaction-Timeout: 3000' -H 'X-NXproperties: *' -H 'X-NXRepository: default' -H 'X-NXVoidOperation: false' -H 'content-type: application/json' -d '{"params":{},"context":{}}' -u "$CYPRESS_FV_USERNAME":"$CYPRESS_FV_PASSWORD")
  if [[ "$response" -ne 204 ]]; then
    echo -e 'Generating Users failed \n'
    exit 1
  fi
  echo

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

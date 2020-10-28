#!/bin/bash

DIRECTORY=$PWD
echo $DIRECTORY

TARGET="http://127.0.0.1:8080"

cd $DIRECTORY
# If "-skip-clone" parameter is supplied then don't do a fresh clone of fv-batch-import and fv-utils
# and skip building the jars.
if [ "$2" != "-skip-clone" ]; then
    mkdir temp

    FVUTILS=$DIRECTORY/cypress/temp/fv-utils-temp
    FVBATCH=$DIRECTORY/cypress/temp/fv-batch-import-temp

    if [ -d "$FVBATCH" ]; then
      echo "pulling fv-batch-import"
      cd $FVUTILS
      git pull
      cd $DIRECTORY
    else
        echo "cloning fv-batch-import"
        git clone https://github.com/First-Peoples-Cultural-Council/fv-batch-import.git ./cypress/temp/fv-batch-import-temp
        if [[ "$?" -ne 0 ]]; then
          echo
          echo -e 'git clone fv-batch-import failed \n'; exit 1
          echo
        fi
    fi

    if [ -d "$FVUTILS" ]; then
      echo "pulling fv-utils"
      cd $FVBATCH
      git pull
      cd $DIRECTORY
    else
      echo "cloning fv-utils"
      git clone https://github.com/First-Peoples-Cultural-Council/fv-utils.git ./cypress/temp/fv-utils-temp
      if [[ "$?" -ne 0 ]]; then
        echo
        echo -e 'git clone fv-utils failed \n'; exit 1
        echo
      fi
    fi

    # Compile jar files from fv-utils and fv-batch-upload
    echo
    cd $DIRECTORY/cypress/temp/fv-utils-temp
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-utils build failed \n'; exit 1
      echo
    fi
    echo
    cd $DIRECTORY/cypress/temp/fv-batch-import-temp
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-batch-import build failed \n'; exit 1
      echo
    fi
fi
echo

cd $DIRECTORY/cypress/temp/fv-utils-temp/target/
# Delete existing TestLanguageOne directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FV_USERNAME -password $CYPRESS_FV_PASSWORD -url $TARGET/nuxeo -language-directory Test/Test/ -language-name DevLangOne
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils DevLangOne teardown failed \n'; exit 1
  echo
fi
echo

echo
echo '-------------------------------------------'
echo 'DevLangOne teardown completed successfully.'
echo '-------------------------------------------'
exit 0
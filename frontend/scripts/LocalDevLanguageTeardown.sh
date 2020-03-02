#!/bin/bash

DIRECTORY=$PWD
echo $DIRECTORY

TARGET="http://127.0.0.1:8080"

cd $DIRECTORY
# If "-skip-clone" parameter is supplied then don't do a fresh clone of fv-batch-import and fv-utils
# and skip building the jars.
if [ "$2" != "-skip-clone" ]; then

    # Delete old copies of fv-utils and fv-batch-import and clone fresh ones
    if [ -d "$DIRECTORY/fv-utils" ]; then
      echo "Removing old fv-utils"
      rm -rf $DIRECTORY/fv-utils
    fi
    if [ -d "$DIRECTORY/fv-batch-import" ]; then
      echo "Removing old fv-batch-import"
      rm -rf $DIRECTORY/fv-batch-import
    fi

    git clone https://github.com/First-Peoples-Cultural-Council/fv-batch-import.git
    git clone https://github.com/First-Peoples-Cultural-Council/fv-utils.git

    # Compile jar files from fv-utils and fv-batch-upload
    echo
    cd $DIRECTORY/fv-utils
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-utils build failed \n'; exit 1
      echo
    fi
    echo
    cd $DIRECTORY/fv-batch-import
    mvn clean install
    # Check that the return code is zero
    if [[ "$?" -ne 0 ]]; then
      echo
      echo -e 'fv-batch-import build failed \n'; exit 1
      echo
    fi
fi
echo

cd $DIRECTORY/fv-utils/target/
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
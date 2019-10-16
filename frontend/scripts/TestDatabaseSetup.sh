#!/bin/bash
#DIRECTORY=$(cd `dirname $0` && pwd)
#echo $DIRECTORY
DIRECTORY=$PWD
echo $DIRECTORY


## Delete old copies of fv-utils and fv-batch-import and clone fresh ones
#if [ -d "$DIRECTORY/fv-utils" ]; then
#  echo "Removing old fv-utils"
#  rm -rf $DIRECTORY/fv-utils
#fi
#if [ -d "$DIRECTORY/fv-batch-import" ]; then
#  echo "Removing old fv--batch-import"
#  rm -rf $DIRECTORY/fv-batch-import
#fi
#
#git clone https://github.com/First-Peoples-Cultural-Council/fv-batch-import.git
#git clone https://github.com/First-Peoples-Cultural-Council/fv-utils.git

# Compile jar files from fv-utils and fv-batch-upload
pushd $DIRECTORY/fv-utils
mvn clean install
# Check that the return code is zero
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils build failed \n'; exit $rc
fi
popd
pushd $DIRECTORY/fv-batch-import
mvn clean install
# Check that the return code is zero
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-batch-import build failed \n'; exit $rc
fi
popd

cd $DIRECTORY/fv-utils/target/
## Delete existing TestLanguageOne directory and all files
#java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageOne
#if [[ "$?" -ne 0 ]]; then
#  echo -e 'fv-utils TestLanguageOne teardown failed \n'; exit $rc
#fi
## Create a fresh TestLanguageOne directory and all files
#java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageOne
#if [[ "$?" -ne 0 ]]; then
#  echo -e 'fv-utils TestLanguageOne creation failed \n'; exit $rc
#fi

# Delete existing TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar delete-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo teardown failed \n'; exit $rc
fi
# Create a fresh TestLanguageTwo directory and all files
java -jar fv-nuxeo-utils-*.jar create-language -username $CYPRESS_FPCCAdmin_USERNAME -password $CYPRESS_FPCCAdmin_PASSWORD -url https://dev.firstvoices.com/nuxeo -language-directory TEst/Test/ -language-name TestLanguageTwo
if [[ "$?" -ne 0 ]]; then
  echo -e 'fv-utils TestLanguageTwo creation failed \n'; exit $rc
fi
# Import Word using fv-batch-import
#cd $DIRECTORY/fv-batch-import/target
#java -jar fv-batch-import-*.jar
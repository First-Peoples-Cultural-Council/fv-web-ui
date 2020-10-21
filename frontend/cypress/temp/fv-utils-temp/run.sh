#!/usr/local/bin/bash

##
## Basic script to export multiple app data configurations 
##

PASSWORD=NUXEO_PASS
URL=https://FV/nuxeo/
BASE_PATH="/PATH/TO/OUTPUT/DATA/"

PROCESS_LANGUAGES=0 # Change to 1 to process languages
VERIFY_LANGUAGES=0 # Change to 1 to verify all files on remote are good. Recommend testing one by one.

#declare -A language0=(
#    [name]='sliammon'
#    [guid]='3e2a3682-6b70-41e3-b82d-2b992ceb0716'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Salish/Northern%20Salishan/Sliammon/learn/words'
#)
#declare -A language1=(
#    [name]='nisga'
#    [guid]='4e93d84a-1643-44ce-8183-d8ffcbf06da9'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Nisga''a/Nisga''a/Nisga''a/learn/words'
#)
#declare -A language2=(
#    [name]='ehat'
#    [guid]='06b82dc1-6b02-4d43-aa1d-6c1bbf1260ad'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Wakashan/Nuu%C4%8Daan%CC%93u%C9%AB/Ehattesaht%20Nuchatlaht/learn/words'
#)
#declare -A language3=(
#    [name]='nstat'
#    [guid]='cc72db1a-0843-4dcb-9f1a-5cefef514f98'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Interior%20Salish/Northern%20St%CC%95%C3%A1t%CC%95imcets/Northern%20St%CC%93%C3%A1t%CC%93imcets/learn/words'
#)
#declare -A language4=(
#    [name]='sces'
#    [guid]='e978b290-fc04-4d43-9e8b-d00444d6acde'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Secwepemc/Secwepemctsin/Secwepemc/learn/words'
#)
#declare -A language5=(
#    [name]='kwak'
#    [guid]='70ecc462-8f1e-43bd-b17f-fb3381a3cf65'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Kwak''wala/Kwak%CC%93wala/Kwak%CC%93wala/learn/words'
#)
#declare -A language6=(
#    [name]='sencoten'
#    [guid]='20de3b31-2f81-43a8-a84b-e1d1ce5554f3'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/THE%20SEN%C4%86O%C5%A6EN%20LANGUAGE/SEN%C4%86O%C5%A6EN/SEN%C4%86O%C5%A6EN/learn/words'
#)
#declare -A language7=(
#    [name]='ktunaxa'
#    [guid]='5a8beaef-48cd-4d42-996e-95def883d47e'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Ktunaxa/Ktunaxa/Ktunaxa/learn/words'
#)
#declare -A language8=(
#    [name]='stolo'
#    [guid]='a4ce6f0d-ce1d-4820-b126-571010a4dfc5'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Salish/Halkomelem/Halq''em%C3%A9ylem'
#)
#declare -A language9=(
#    [name]='lilwat'
#    [guid]='2fc09216-50af-4a21-a436-a49851b4689b'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/St%CC%95%C3%A1t%CC%95imc/Lil''wat/L%C3%ADl%CC%93wat/learn/words'
#)
#declare -A language10=(
#    [name]='xeni'
#    [guid]='95033c71-bea3-4955-915a-e73121062de2'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Athabascan/Tsilhqot''in%20(Xeni%20Gwet''in)/Tsilhqot''in%20(Xeni%20Gwet''in)/learn/words'
#)
#declare -A language11=(
#    [name]='skid'
#    [guid]='e93004e4-e2fa-48eb-9fc1-7a76e585cb5a'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Haida/Hlg%CC%B1aagilda%20X%CC%B1aayda%20Kil/Hlg%CC%B1aagilda%20X%CC%B1aayda%20Kil/learn/words'
#)
#declare -A language12=(
#    [name]='nazko'
#    [guid]='b3782c3a-3dbd-4fad-a423-1d7de0c466d9'
#    [fv_url]='https://www.firstvoices.com/explore/FV/sections/Data/Athabascan/Dakelh/Dakelh%20_%20Southern%20Carrier/learn/words'
#)
#
#declare -A language13=(
#    [name]='Tseshaht'
#    [guid]='62b2cd86-80cf-47c5-bee8-c7113ba4ddd1'
#    [fv_url]=''
#)
#
#declare -A language14=(
#    [name]='Hailzaqvla'
#    [guid]='60b25d1c-7602-47f0-bf2e-9757f32ae523'
#    [fv_url]=''
#)
#declare -A language15=(
#    [name]='Tsekhene-mcleod-lake'
#    [guid]='58f500d9-7324-407b-99b8-f1dfdbe9255e'
#    [fv_url]=''
#)
#
#
#declare -A language16=(
#    [name]='She-shashishalhem'
#    [guid]='cbf5f485-af51-4c6c-90cf-812bf7bd6978'
#    [fv_url]=''
#)

####
# Process languages
####

if [ "$PROCESS_LANGUAGES" -eq "1" ]; then

  declare -n language
  for language in ${!language@}; do
      LANGUAGE_PATH=${BASE_PATH}${language[name]}
      REMOTE_PATH="https://fv-app-data.s3.ca-central-1.amazonaws.com/${language[name]}/"
      # echo "Name: ${language[name]}"
      # echo "GUID: ${language[guid]}"
      # echo "FV URL: ${language[fv_url]}"
      # echo ${language[fv_url]}
      # echo "${REMOTE_PATH}words.json"
      # echo "${REMOTE_PATH}phrases.json"
      # echo "***"
      mkdir ${LANGUAGE_PATH}
      java -jar target/fv-nuxeo-utils-1.0-SNAPSHOT.jar dictionary-app-compatible-export -url ${URL} -slugifyBlobs -downloadBlobs -pageSize 500 -exportType FVWord -username dyona -dictionary ${language[guid]} -export-dir ${LANGUAGE_PATH} -remotePath ${REMOTE_PATH} -password ${PASSWORD}
      java -jar target/fv-nuxeo-utils-1.0-SNAPSHOT.jar dictionary-app-compatible-export -url ${URL} -slugifyBlobs -downloadBlobs -pageSize 500 -exportType FVPhrase -username dyona -dictionary ${language[guid]} -export-dir ${LANGUAGE_PATH} -remotePath ${REMOTE_PATH} -password ${PASSWORD}
      mv ${LANGUAGE_PATH}/FVAudio.json ${LANGUAGE_PATH}/audio.json
      mv ${LANGUAGE_PATH}/FVWord.json ${LANGUAGE_PATH}/words.json
      mv ${LANGUAGE_PATH}/FVPhrase.json ${LANGUAGE_PATH}/phrases.json
      jsonlint ${LANGUAGE_PATH}/words.json -q && jsonlint ${LANGUAGE_PATH}/phrases.json -q
      aws s3 cp ${LANGUAGE_PATH} s3://fv-app-data/${language[name]}/ --acl public-read --recursive
  done

fi


####
# Verify languages
####

if [ "$VERIFY_LANGUAGES" -eq "1" ]; then

  declare -n language
  for language in ${!language@}; do
      LANGUAGE_PATH=${BASE_PATH}${language[name]}
      REMOTE_WORDS="https://fv-app-data.s3.ca-central-1.amazonaws.com/${language[name]}/words.json"
      REMOTE_PHRASES="https://fv-app-data.s3.ca-central-1.amazonaws.com/${language[name]}/phrases.json"
      jsonlint ${LANGUAGE_PATH}/words.json -q && jsonlint ${LANGUAGE_PATH}/phrases.json -q

      echo "Validating words audio..."

      WORDS_PROCESSED=0

      curl ${REMOTE_WORDS}| jq -r '.[] | select(.audio != null).audio[].filename' | while read file ; do
          # Check if binary file exists in remote
          if [ $(curl  -o /dev/null --silent --head -w "%{http_code}\n" ${file}) -ne "200" ]; then
            echo "File not found: ${file}"
          fi

          let WORDS_PROCESSED=WORDS_PROCESSED+1
          if [ $(( $WORDS_PROCESSED % 100 )) -eq 0 ]; then
            echo "Verified ${WORDS_PROCESSED} words..."
          fi

      done

      echo "Validating phrases audio..."

      PHRASES_PROCESSED=0

      curl ${REMOTE_PHRASES}| jq -r '.[] | select(.audio != null).audio[].filename' | while read file ; do
          # Check if binary file exists in remote
          if [ $(curl  -o /dev/null --silent --head -w "%{http_code}\n" ${file}) -ne "200" ]; then
            echo "File not found: ${file}"
          fi

          let PHRASES_PROCESSED=PHRASES_PROCESSED+1
          if [ $(( PHRASES_PROCESSED % 100 )) -eq 0 ]; then
            echo "Verified ${PHRASES_PROCESSED} phrases..."
          fi

      done

  done

fi


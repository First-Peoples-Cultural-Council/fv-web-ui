#!/bin/bash

# This script will perform the transition for items in QA Done when a release is performed.

TAGNAME=$1
URL=$2
INITIALIFS=$IFS

echo ''
echo 'Current release: ' $TAGNAME

# Get the previous release tag
LASTTAG=$(curl -s https://api.github.com/repos/$URL/releases?per_page=25 | jq '.[] | {tag_name: .tag_name}')

# Change the delimter to help with regex matching.
IFS=$(echo -en "} {")

# Remove excess info from the tag
FILTERONE=""
for i in $LASTTAG
do
    if [[ $i =~ \"release-[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}.* ]]; then
        FILTERONE="$FILTERONE ${BASH_REMATCH}"
    fi
done

# Filter out any releases matching the current one and and RC releases
IFS=$(echo -en " ")
FILTEREDLIST=""
for i in $FILTERONE
do
    # Filter the list
    if [[ ! $i =~ $TAGNAME && ! $i =~ release-[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}-[rR][cC] ]]; then
        if [[ $i =~ release-[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}.*\" ]]; then
            FILTEREDLIST="$FILTEREDLIST ${BASH_REMATCH}"
        fi
    fi
done

# Get the first found entry and trim the quotation mark at the end
PREVRELEASE=($FILTEREDLIST)
PREVRELEASE=${PREVRELEASE%?}

echo 'Previous release: ' $PREVRELEASE
echo ''
echo ''

# Get the commit messages between the new release and the previous one
COMMITS=$(curl -s https://api.github.com/repos/$URL/compare/$PREVRELEASE...$TAGNAME | jq '[. | .commits[].commit | {message: .message}]')
# Replace commas with a space for easy matching
COMMITS=${COMMITS//,/ }

# Remove all items matching the pattern FW-XXXXX from the list and append them to KEYLIST
KEYLIST=""
for f in $COMMITS
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        KEYLIST="$KEYLIST ${BASH_REMATCH}"
    fi
done

# Filter out any duplicates
KEYLIST="$(echo $KEYLIST | tr ' ' '\n' | sort | uniq | xargs)"

echo 'The list of issue keys found between releases:'
echo $KEYLIST
echo ''
echo ''

# Iterate through the issue key list and if the status is QA DONE and the
# labels list contains DEPLOYED-DEV then perform the transition.
IFS=$INITIALIFS
for i in $KEYLIST
do
    # If an item matches the issue key pattern FW-XXXXX then check if it exists on Jira, and that it
    # has been deployed/QA'd on dev and preprod and is currently in the QA Done status.
    FOUND=false
    LABEL=false
    STATUS=false
    jira view $i > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
        FOUND=true
        INFO=$(jira view $i)
        if [[ $(echo $INFO | grep -o 'labels:[[:space:]].*[[:space:]]description:') =~ DEPLOYED-DEV && $(echo $INFO | grep -o 'labels:[[:space:]].*[[:space:]]description:') =~ DEPLOYED-PREPROD ]]; then
            LABEL=true
            echo $i ': DEPLOYED-DEV label found successfully and DEPLOYED-PREPROD label found successfully.'
        fi
        if [[ $(echo $INFO | grep -o 'status:[[:space:]].*[[:space:]]summary:') =~ QA[[:space:]]Done ]]; then
            STATUS=true
            echo $i ': In QA DONE status.'
        fi
    else
        FOUND=false
    fi

    # If The issue has been QA'd on dev and preprod then transition to launched and unassign or else
    # give some output saying why it was not transitioned.
    if [[ $LABEL = true && $STATUS = true ]]; then
        echo $i ": Transitioning - QA DONE -> Launched."
        jira transition --noedit "Launched" $i
        echo $i ": Unassigning issue."
        jira unassign $i
        echo $i ": Adding comment to issue."
        jira comment --noedit --comment="This issue has been QA'd on preprod and will be deployed to production." $i
    fi
    if [[ $FOUND = false ]]; then
        echo $i ': No transition performed. Issue key could not be found on Jira.'
    else
        if [[ $LABEL = false ]]; then
            echo $i ': No transition performed. The DEPLOYED-DEV label does not exist or the DEPLOYED-PREPROD label does not exist. '
        fi
        if [[ $STATUS = false ]]; then
            echo $i ': No transition performed. The issue does not have the QA Done status.'
        fi
    fi
    echo ''
done
if [[ $KEYLIST = '' ]]; then
    echo 'No issue key found to transition.'
fi
echo ''
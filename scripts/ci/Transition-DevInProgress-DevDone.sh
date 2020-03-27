#!/bin/bash

# This script will perform the actions needed to transition the appropriate issues from
# DEV IN PROGRESS to DEV DONE

# Save commit messages to the variable
PRTITLE=$1
URL=$2
PRNUM=$3

# Replace commas with spaces for pattern matching
PRTITLE=${PRTITLE//,/ }

# Remove all items matching the pattern from the list and append them to FILTEREDLIST
FILTEREDLIST=""
for f in $PRTITLE
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        FILTEREDLIST="$FILTEREDLIST ${BASH_REMATCH}"
    fi
done

# Filter out any duplicates
FILTEREDLIST="$(echo $FILTEREDLIST | tr ' ' '\n' | sort | uniq | xargs)"

# Get commit messages and combine with the pr title
COMMITS=$(curl -s https://api.github.com/repos/$URL/pulls/$PRNUM/commits | jq '.[].commit.message')
FILTEREDLIST="$FILTEREDLIST $COMMITS"

# Replace commas and quotation marks with spaces for easy pattern matching
FILTEREDLIST=${FILTEREDLIST//,/ }
FILTEREDLIST=${FILTEREDLIST//\"/ }

# Remove all items matching the pattern FW-XXXXX from the list and append them to KEYLIST
KEYLIST=""
for f in $FILTEREDLIST
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        KEYLIST="$KEYLIST ${BASH_REMATCH}"
    fi
done

# Filter out any duplicates
KEYLIST="$(echo $KEYLIST | tr ' ' '\n' | sort | uniq | xargs)"
echo 'KEYLIST:'
echo $KEYLIST
echo''
# Iterate through each issue found in the commit messages and perform Jira actions on each
for f in $KEYLIST
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        ISSUE=${BASH_REMATCH}
        FOUND=false
        jira view $ISSUE > /dev/null 2>&1
        if [[ $? -eq 0 ]]; then
            FOUND=true
        fi
        if [[ $FOUND = true ]]; then
            STATUS=false
            INFO=$(jira view $ISSUE)
            if [[ $(echo $INFO | grep -o 'status:[[:space:]].*[[:space:]]summary:') =~ Dev[[:space:]]In[[:space:]]Progress ]]; then
                STATUS=true
            fi
            if [[ $STATUS = true ]]; then
                echo $ISSUE ": Transitioning - DEV IN PROGRESS -> DEV DONE."
                jira transition --noedit "DEV DONE" $ISSUE
                echo ""
            else
                echo $ISSUE ": No transition performed. Issue is not in the DEV IN PROGRESS status."
            fi
        else
            echo $ISSUE ": No transition performed. Issue not found on jira."
        fi
        echo ''
    fi
done
if [[ $KEYLIST = '' ]]; then
    echo 'No issue key found to transition.'
fi
echo ''

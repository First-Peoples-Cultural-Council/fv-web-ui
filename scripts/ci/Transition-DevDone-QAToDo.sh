#!/bin/bash

# This script will perform the actions needed to transition the appropriate issues from
# DEV DONE to QA TO DO

# Save commit messages to the variable
COMMITMESSAGES=$1

# Replace commas with spaces for pattern matching
COMMITMESSAGES=${COMMITMESSAGES//,/ }

# Remove all items matching the pattern from the list and append them to FILTEREDLIST
FILTEREDLIST=""
for f in $COMMITMESSAGES
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        FILTEREDLIST="$FILTEREDLIST ${BASH_REMATCH}"
    fi
done

# Filter out any duplicates
FILTEREDLIST="$(echo $FILTEREDLIST | tr ' ' '\n' | sort | uniq | xargs)"

# Iterate through each issue found in the commit messages and perform Jira actions on each
echo ''
for f in $FILTEREDLIST
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
            INFO=$(jira view ${BASH_REMATCH})
            if [[ $(echo $INFO | grep -o 'status:[[:space:]].*[[:space:]]summary:') =~ Dev[[:space:]]Done ]]; then
                STATUS=true
            fi
            if [[ $STATUS = true ]]; then
                echo $ISSUE ": Transitioning - DEV DONE -> QA TO DO."
                jira transition --noedit "QA TO DO" $ISSUE
                echo $ISSUE ": Unassigning issue."
                jira unassign $ISSUE
                echo $ISSUE ": Adding DEPLOYED-DEV label to issue."
                jira labels add $ISSUE DEPLOYED-DEV
                echo $ISSUE ": Adding comment to issue."
                jira comment --noedit --comment="This issue has been merged to master and will be deployed to dev.firstvoices.com automatically." $ISSUE
            else
                echo $ISSUE ": No transition performed. Issue is not in the DEV DONE status."
            fi
        else
            echo $ISSUE ": No transition performed. Issue not found on jira."
        fi
    fi
    if [[ $ISSUESFOUND == 0 ]]; then
        echo 'No issues in commit messages to transition.'
    fi
    echo ''
    echo ''
done
if [[ $FILTEREDLIST = '' ]]; then
    echo 'No issue key found to transition.'
fi
echo ''

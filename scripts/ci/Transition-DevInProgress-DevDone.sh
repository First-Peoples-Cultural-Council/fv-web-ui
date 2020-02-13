#!/bin/bash

# This script will perform the actions needed to transition the appropriate issues from
# DEV IN PROGRESS to DEV DONE

# Save commit messages to the variable
COMMITMESSAGES=$1

# Replace commas with spaces for pattern matching
COMMITMESSAGES=${COMMITMESSAGES//,/ }

# Remove all items matching the patter from the list and append them to FILTEREDLIST
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
for f in $FILTEREDLIST
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        echo ${BASH_REMATCH}
        echo "Transitioning - DEV IN PROGRESS -> DEV DONE: " ${BASH_REMATCH}
        jira transition --noedit "DEV DONE" ${BASH_REMATCH}
        echo ""
    fi
done

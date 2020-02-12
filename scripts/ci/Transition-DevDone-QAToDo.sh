#!/bin/bash

# This script will perform the actions needed to transition the appropriate issues from
# DEV DONE to QA TO DO

# Save commit messages to the variable
COMMITMESSAGES=$1

# Replace commas with spaces for pattern matching
COMMITMESSAGES=${COMMITMESSAGES//,/ }

# Iterate through each issue found in the commit messages and perform Jira actions on each
for f in $COMMITMESSAGES
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        echo "Transitioning - DEV DONE -> QA TO DO: " ${BASH_REMATCH}
        jira transition --noedit "QA TO DO" ${BASH_REMATCH}
        echo ""
        echo "Unassigning issue: " ${BASH_REMATCH}
        jira unassign --default ${BASH_REMATCH}
        echo ""
        echo "Adding DEPLOYED-DEV label to issue:" ${BASH_REMATCH}
        jira labels add ${BASH_REMATCH} DEPLOYED-DEV
        echo ""
        echo "Adding comment to issue:" ${BASH_REMATCH}
        jira comment --noedit --comment="This issue has been merged to master and will be deployed to dev.firstvoices.com automatically." ${BASH_REMATCH}
        echo ""
    fi
done

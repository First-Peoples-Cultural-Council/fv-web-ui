#!/usr/bin/env bash

# Will check commit messages for issue key and if one is found it will check Jira
# for a matching issue key.  If one is found this script will return true.

# Save commit messages to the variable
COMMITMESSAGES=$1

# Replace commas with spaces for pattern matching
COMMITMESSAGES=${COMMITMESSAGES//,/ }

# Variable which change to true if everything goes well
RETURNVALUE="false"

# Variable to count the number of issues matching the pattern FW-XXXXX
NUMISSUES=0

# Variable to count the number of issues that
MISSINGISSUECOUNT=0

# Iterate through each item found in the commit messages with a space as a delimiter
for f in $COMMITMESSAGES
do
    # If an item matches the issue key pattern FW-XXXXX then check if it exists on Jira
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        NUMISSUES=$((NUMISSUES+1))
        jira view ${BASH_REMATCH} > /dev/null 2>&1
        if [[ $? -eq 0 ]]; then
            RETURNVALUE="true"
        else
            MISSINGISSUECOUNT=$((MISSINGISSUECOUNT+1))
        fi
    fi
done

# If all issue keys found are also on Jira and at least one issue key is found then return true otherwise output an error.
if [[ $RETURNVALUE == "true" && $NUMISSUES != 0 && $MISSINGISSUECOUNT == 0 ]]; then
    echo "true"
elif [ $NUMISSUES == 0 ]; then
    echo "No issue key matching the pattern FW-XXXXX could be found in the commit messages."
elif [ $MISSINGISSUECOUNT > 0 ]; then
    echo $MISSINGISSUECOUNT " of the matching issue keys in the commit messages could not be found on Jira."
else
    echo "false"
fi

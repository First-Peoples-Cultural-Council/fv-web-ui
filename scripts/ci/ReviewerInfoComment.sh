#!/bin/bash

# This script will add a comment to the any issues found in the pull request title and commits
# stating who reviewed the pull request.

# Get the reviewer username and the pr title
REVIEWER=$1
TITLE=$2
URL=$3
PRNUM=$4

# Replace commas with spaces for pattern matching
TITLE=${TITLE//,/ }

# Remove all items matching the pattern from the list and append them to FILTEREDLIST
FILTEREDLIST=""
for f in $TITLE
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

# Iterate through each issue found in the commit messages and perform Jira actions on each
for f in $KEYLIST
do
    if [[ $f =~ FW-[0-9]{1,5} ]]; then
        FOUND=false
        jira view ${BASH_REMATCH} > /dev/null 2>&1
        if [[ $? -eq 0 ]]; then
            FOUND=true
        fi
        if [[ $FOUND = true ]]; then
            echo ${BASH_REMATCH} ": Adding pull request reviewer info to issue."
            jira comment --noedit --comment="The pull request for this issue was reviewed by https://github.com/$REVIEWER" ${BASH_REMATCH}
        else
            echo ${BASH_REMATCH} ": Issue not found on jira. No comment added."
        fi
    fi
    echo ''
done
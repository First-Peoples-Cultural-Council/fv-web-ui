#!/bin/bash

# This script uses the github API to check that there are no pending reviews on a PR
# and that each requested reviewer has approved the PR.

# hold the pull request number which is passed in
PRNUM=$1

# Get the repo and owner which is passed in
URL=$2

# Get the info about the reviewers on the pull request.
reviewers=$(curl -s https://api.github.com/repos/$URL/pulls/$PRNUM/requested_reviewers)

# Create variables to hold the total number of requested reviewers and the total approved reviews.
PENDING=0

# Change the delimiter to a comma to help with regex matching.
IFS=$(echo -en ",")

# Loop through the curl response to get the number of users reviewing the PR.
for i in $reviewers
do
    if [[ $i =~ \"type\":[[:space:]]\"User\" ]]; then
        PENDING=$((PENDING+1))
    fi
done
# Get info about all reviews currently on the PR.
reviews=$(curl -s https://api.github.com/repos/$URL/pulls/$PRNUM/reviews)

# Go through all reviews on the PR and pull out review IDs and reviewer user names
declare -a IDs=()
declare -a USERS=()
count=1
for line in $reviews
do
    if [[ $line =~ \"id\":[[:space:]][0-9]* ]]; then
        if [[ count -eq 1 ]]; then
            IDs+=(${BASH_REMATCH:6})
            count=0
        else
            count=1
        fi
    fi
    if [[ $line =~ \"login\":[[:space:]]\".*\" ]]; then
        if [[ -z "${USERS[@]}" ]]; then
            USERS+=(${BASH_REMATCH:9})
        else
            foundUser=0
            for user in "${USERS[@]}"
            do
                if [[ $user == ${BASH_REMATCH:9} ]]; then
                    foundUser=1
                fi
            done
            if [[ foundUser -eq 0 ]]; then
                USERS+=(${BASH_REMATCH:9})
            fi
        fi

    fi
done

# For each reviewer username check that an approved review exists
all_approved=1
for user in $USERS
do
    id_match=0
    approved=0
    for ID in "${IDs[@]}"
    do
        review=$(curl -s https://api.github.com/repos/$URL/pulls/$PRNUM/reviews/$ID)
        for line in $review
        do
            if [[ $line =~ \"login\":[[:space:]]$user ]]; then
                id_match=1
            fi
            if [[ $line =~ \"state\":[[:space:]]\"APPROVED\" ]]; then
                approved=1
            fi
        done
    done
    if [[ id_match -eq 0 || approved -eq 0 ]]; then
        all_approved=1
    fi
done

# Check for pending reviews and check that each reviewer has approved the PR
if [[ $PENDING == 0 && $all_approved == 1 ]]; then
    echo "All reviews approved (or no reviews requested)."
else
    echo "Still waiting for reviews to be approved."
fi
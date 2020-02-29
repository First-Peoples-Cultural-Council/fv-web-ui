#!/bin/bash

# This script uses the github API to check that there are no pending reviews on a PR
# and that any completed reviews are APPROVED.

# hold the pull request number which is passed in
PRNUM=$1

# Get the repo and owner which is passed in
URL=$2

# Get the info about the reviewrs on the pull request.
reviewers=$(curl -s https://api.github.com/repos/$URL/pulls/$PRNUM/requested_reviewers)

# Create variables to hold the total number of requested reviewers and the total approved reviews.
REVIEWERCOUNT=0
APPROVEDCOUNT=0
NOTAPPROVEDCOUNT=0

# Change the delimter to a comma to help with regex matching.
IFS=$(echo -en ",")

# Loop through the curl response to get the number of users reviewing the PR.
for i in $reviewers
do
    if [[ $i =~ \"type\":[[:space:]]\"User\" ]]; then
        REVIEWERCOUNT=$((REVIEWERCOUNT+1))
    fi
done

# Get info about all reviews currently on the PR.
review=$(curl -s https://api.github.com/repos/$URL/pulls/$PRNUM/reviews)

# Loop through the curl response to get the number of reviews that are currently approved on the PR.
for i in $review
do
    if [[ $i =~ \"state\":[[:space:]]\"APPROVED\" ]]; then
        APPROVEDCOUNT=$((APPROVEDCOUNT+1))
    fi
    if [[ $i =~ \"state\":[[:space:]]\"PENDING\" ]]; then
        NOTAPPROVEDCOUNT=$((NOTAPPROVEDCOUNT+1))
    fi
    if [[ $i =~ \"state\":[[:space:]]\"CHANGES_REQUESTED\" ]]; then
        NOTAPPROVEDCOUNT=$((NOTAPPROVEDCOUNT+1))
    fi
done

# Make sure the number of reviews requested and not complete is zero
# and check that the number of changes requested reviews is zero.
if [[ $REVIEWERCOUNT == 0 && $NOTAPPROVEDCOUNT == 0 ]]; then
    echo "All reviews approved (or no reviews requested)."
else
    echo "Still waiting for reviews to be approved."
fi
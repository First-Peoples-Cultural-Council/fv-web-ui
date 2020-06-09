#!/bin/bash

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

# Install wait-on to wait for site to be available before running tests
npm install -g wait-on

echo "Cypress Base URL is set to {$CYPRESS_BASE_URL}"

# Wait for last language to be setup and accessible
wait-on $CYPRESS_BASE_URL/nuxeo/api/v1/path/FV/sections/Data/Test/Test/TestLanguageEight && \
    npm ci && \
    npm run cy:trashCopy && \ 
    npm run cy:copy && \
    cypress run --browser chrome --headless \
    --tag "Jenkins"  --record true
#!/bin/bash

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

# Install wait-on to wait for site to be available before running tests
npm install -g wait-on

echo "Cypress Base URL is set to {$CYPRESS_BASE_URL}"

echo "*****"
echo "Cypress CI config (`frontend/cypress_CI.json` -> `/e2e/cypress.json`) file content:"
cat /e2e/cypress.json
echo "*****"

# Wait for last language to be setup and accessible
wait-on $CYPRESS_BASE_URL/nuxeo/api/v1/path/FV/sections/Data/Test/Test/TestLanguageEight && \
    npm ci --quiet && \
    npm run --silent cy:trashCopy && \
    npm run --silent cy:copy && \
    cypress run --browser chrome --headless --tag "Jenkins"  --record true

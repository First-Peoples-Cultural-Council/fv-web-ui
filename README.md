[![](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/workflows/Build/badge.svg?branch=master)](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/actions)
[![](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/workflows/Cypress%20Tests/badge.svg?branch=master)](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ca.firstvoices%3Afirstvoices-modules-parent&metric=alert_status)](https://sonarcloud.io/dashboard?id=ca.firstvoices%3Afirstvoices-modules-parent)
# FirstVoices
[FirstVoices](https://www.firstvoices.com/) is a responsive, web-based language revitalization platform that uses [Nuxeo ECM](https://www.nuxeo.com/) as a back-end with a front-end built in [ReactJS](https://facebook.github.io/react/).

## To run the back-end (default: localhost:8080)
Follow the README in [/docker](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/docker)

## To run the front-end (default: localhost:3001)
Follow the README in [/frontend](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend)

## Build for production
To build the entire project (back-end and front-end) for release, run:
```mvn clean install```

You can then deploy a generated marketplace package on a Nuxeo instance using:
```
nuxeoctl mp-install FirstVoices-marketplace/target/FirstVoices-marketplace-package-latest.zip
```

Note: In production, by default, the packaged React App will be running at http://localhost:8080/nuxeo/app. The 
server is intended to run behind a reverse proxy, hiding the "/nuxeo/app" context path.

## Build for development
To build the entire project (without downloading new dependencies), use the Dev profile:
```mvn clean install -Pdev```

## New backend modules
When creating a new backend module ensure it follows the naming convention by starting with FirstVoices or FV to ensure it is picked up by build CI.

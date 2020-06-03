# FirstVoices-marketplace

## Module Description
This module creates an installable package (ZIP) that can be added to a Nuxeo instance. It includes all relevant other modules from this project as dependencies (i.e. in `pom.xml`).

In addition, it loads [configuration templates](https://doc.nuxeo.com/nxdoc/configuration-templates/) into the Nuxeo instance which override default configuration settings in Nuxeo. These are applied before the server starts. 

## Learn More

* [Read more about Nuxeo packages](https://doc.nuxeo.com/glos/nuxeo-package/)
* [Learn how to install Nuxeo packages](https://doc.nuxeo.com/nxdoc/next/installing-a-new-package-on-your-instance/)
* [Learn about the Nuxeo Ant Assembly plugin](https://github.com/nuxeo/ant-assembly-maven-plugin)
[![](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/workflows/Build/badge.svg?branch=master)](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/actions)
## Install

### Using Tomcat distribution

Download Nuxeo 10.10 and install:

```
https://maven.nuxeo.org/nexus/service/local/repositories/public-releases/content/org/nuxeo/ecm/distribution/nuxeo-server-tomcat/10.10/nuxeo-server-tomcat-10.10-full.zip
```

Do NOT install the nuxeo-web-ui package, install headless.

## Configure

Set the context path in nuxeo.conf
For your local environment, this can be an empty string.

```
fv.contextPath=
```

If you are running your app at /nuxeo/app, for example, configure it to be `app`

## Deploy

To connect to Studio run:            

```
nuxeoctl register
```

To add the First Voices package, first go to Nuxeo Studio, go to Branch Management, then CHECKOUT (!) feature/migration-10-10.
You should now be on a seperate branch in Studio.

Install the First Voices package on your Nuxeo server (must be stopped):
```
nuxeoctl mp-add First-Voices
nuxeoctl mp-install First-Voices
```

## Maven Authentication

Since some of the Maven repositories require authentication, you need to setup a local Maven master password:

1. Use the [following instructions to setup a master password](https://maven.apache.org/guides/mini/guide-encryption.html#How_to_create_a_master_password) that will be used to encrypt additional passwords. Make sure it is stored in settings-security.xml (as mentioned in the instructions)

2. Copy sample.settings.xml from this repo, to your Maven home directory, and rename to settings.xml.

3. Encrypt your password (instructions also in guide above), and replace the username/password values in settings.xml with the encrypted strings.

## Build

There are 2 ways to get your local packages on your Nuxeo instance. One is by running mvn clean install, and installing the generated package via command line, the other is by hot-reloading. Use the latter if you intend to develop or modify the packages.
```
By default, the packaged React App is running at http://localhost:8080/nuxeo/app. In production, the 
server is running behind a reverse proxy, hiding the "/nuxeo/app" context path so you have to build the marketplace package and configure the server depending if you are behind a reverse proxy or not.  
```

*Method 1*

In order to build the FirstVoices marketplace package run on branch dy-v2.2.0:
 - running with *NO reverse proxy*, for example when you run on your localhost
```
mvn clean install -Pdev
```
and set the following property in nuxeo.conf on your server
```
fv.contextPath=app
```

- running behind a reverse proxy
```
mvn clean install -Pdev
```
and dont set anything in nuxeo.conf, the packaged app is deployed at http://localhost:8080 

To install the mp on your Nuxeo:

```
nuxeoctl mp-install FirstVoices-marketplace/target/FirstVoices-marketplace-package-3.0.1-SNAPSHOT.zip
```
*Note:* If you are not running behind a proxy, add this property *fv.contextPath=app* in *nuxeo.conf* on your server
*Note:* Check the actual package number after it was built. It maybe different than example above.

*Method 2*

1. Install nuxeo-cli by following the instructions here: https://doc.nuxeo.com/nxdoc/nuxeo-cli/

2. In the main directory that has your parent pom.xml, run `nuxeo hotreload configure` to setup the local Nuxeo server URL and what pacakges will be hotreloaded.

3. After you make a change in a method, run `mvn clean compile` and then `nuxeo hotreload` to see those changes on the server.


## Apps

Default backend is : http://localhost:8080/nuxeo/jsf or http://localhost:8080/nuxeo/view_documents.faces
React app at: http://localhost:8080/nuxeo/app/ or at http://localhost:8080/ ( see above)

## How to release
Curently, we are realasing from the branch *dy-v2.2.0*:
1. Perform a release of your branch in Studio
2. Change the property *fv.studio.version* in the main *pom.xml* to point to that release instead of *migration-10-10-SNAPSHOT*
3. Run the pipeline [firstvoices-release-pipeline](https://openshift.prod.nuxeo.io/console/project/cust-firstvoices/browse/pipelines/firstvoices-release-pipeline?tab=history) ; the pipeline will ask you to input the versioning schema you want for this release
4. The pipeline will ask you if you want to deploy this version to Connect, click YES
5. After the pipeline has finished and the release has done we want to be in SNAPSHOT again:
- the poms have been changed to the next SNAPSHOT version. 
- However, this was not done for the Studio version, so you have to manually change the property
- *fv.studio.version* in the main *pom.xml*  to *migration-10-10-SNAPSHOT* or *your_branch_in_studio-SNAPSHOT*
6. Create a SUPNXP and ask for the MP with version from XXX to be deployed in pre -production or prroduction

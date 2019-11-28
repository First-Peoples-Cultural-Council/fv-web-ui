# Docker development environment (meant for localhost work)

This environment is setup for localhost work. It includes an embedded database (Derby), and embedded Elasticsearch.

# Method 1:
## Prerequisites

1. You must have Docker installed and running, as well as git installed. Docker can be downloaded from [this link](https://docs.docker.com/install/) and git can be downloaded from [this link](https://git-scm.com/downloads).
2. Basic knowledge of Docker, Nuxeo and bash.
3. Ensure you have the two environment variables set for CYPRESS_FV_USERNAME and CYPRESS_FV_PASSWORD which will be passed into the container and used to create an admin account during the initial setup.


## Initial Setup

### Step 1:

Clone the fv-web-ui repository and navigate into fv-web-ui/docker/
```
git clone https://github.com/First-Peoples-Cultural-Council/fv-web-ui.git
cd ./fv-web-ui/docker
```

### Step 2:
#### There are now two options:
#### Option A - Run the setup script (easier but less control - recommended):
##### A-1:
```
./setup_docker.sh
```
You may have to give the script execute permission first:
```
chmod +x setup_docker.sh
```
#### Option B - Run the commands individually:
##### B-1:
Navigate to the cloned folder and build this image locally:
```docker build -t me/nuxeo-dev .```

##### B-2::
Setup a folder on your local machine to store some persistant data from within the container (e.g. Nuxeo data), and a built package of FirstVoices, for example: `~/Dev/Dependencies/nuxeo_dev_docker`

##### B-3:
In the `fv-web-ui` project (cloned from https://github.com/First-Peoples-Cultural-Council/fv-web-ui), run `mvn clean install`, then copy the package `FirstVoices-marketplace/target/FirstVoices-marketplace-package-latest.zip` into the `nuxeo_dev_docker` folder. It is best to build the application outside of the docker container to make use of Maven and Node caching.

The Option B `run` command below assumes the following volumes on the host (change to match your file structure):

`~/Dev/Dependencies/nuxeo_dev_docker` = Directory on host mapped to /tmp/ directory. Useful for storing data you want to persist in the container.
`~/Dev/Dependencies/nuxeo_dev_docker/data` = Directory where Nuxeo data will be stored persisted.
`~/Dev/Dependencies/nuxeo_dev_docker/logs` = Directory where log files will be mapped.

### Step 3:
##### Startup the docker container
If you used Option A and are in the fv-web-ui/docker/ directory:
```
docker run --name nuxeo-dev --rm -ti -p 8080:8080 -v ${PWD}/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ${PWD}/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -v ${PWD}/nuxeo_dev_docker/logs:/var/log/nuxeo -e NUXEO_PACKAGES="nuxeo-dam nuxeo-jsf-ui" -e NUXEO_URL="http://localhost:8080" me/nuxeo-dev
```

If you used Option B:
```
docker run --name nuxeo-dev --rm -ti -p 8080:8080 -v ~/Dev/Dependencies/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ~/Dev/Dependencies/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -v ~/Dev/Dependencies/nuxeo_dev_docker/logs:/var/log/nuxeo -e NUXEO_PACKAGES="nuxeo-dam nuxeo-jsf-ui" -e NUXEO_URL="http://localhost:8080" me/nuxeo-dev
```

This may take a few minutes as Nuxeo starts up.

Note:\
To expose Debug port: ```-p 8787:8787```\
To include automation traces: ```-e NUXEO_AUTOMATION_TRACE="true"```\
To enable Dev mode: ```-e NUXEO_DEV_MODE="true"```\
To change the data folder: ```-e NUXEO_DATA="/opt/nuxeo/ext_data"```\
To pass in environment variables for the creation of an administrator: ```-e CYPRESS_FV_USERNAME -e CYPRESS_FV_PASSWORD```

### Step 5:

Run the initial backend setup script in a new terminal once the backend server has started:

```
./initialsetup.sh
```
You may have to give the script execute permission first:
```
chmod +x initialsetup.sh
```

### Step 6:

Go to localhost:8080, or run the UI locally via NPM and point it to http://localhost:8080\
The backend should be up and accessible.
## Pushing Changes

After you've made changes to a FirstVoices module or modules, you can copy that module (JAR or ZIP) into your container and test the changes.


##########


# Method 2:
## Using Docker

## Prerequisites

1. You must have Docker installed and running.
2. Basic knowledge of Docker, Nuxeo and bash.
3. A valid CLID for the Nuxeo server registration for your DEV instance.
4. (Recommended) Vault server installed on local machine with the CLID configured (https://www.vaultproject.io/)
5. Ensure you have the two environment variables set for CYPRESS_FV_USERNAME and CYPRESS_FV_PASSWORD which will be passed into the container and used to create an admin account during the initial setup.

### Step 1:
Navigate to the folder with your Dockerfile and build this image locally:

```
docker build -t me/nuxeo-dev .
```
### Step 2:
Run the Docker container:

```
docker run --name nuxeo-dev --rm -ti -v ~/Dev/Dependencies/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ~/Dev/Dependencies/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -v ~/Dev/Dependencies/nuxeo_dev_docker/logs:/var/log/nuxeo -p 8080:8080 -p 8787:8787 -p 3002:3001 -e NUXEO_PACKAGES="nuxeo-dam " -e NUXEO_AUTOMATION_TRACE="true" -e NUXEO_DEV_MODE="true" -e NUXEO_DATA="/opt/nuxeo/ext_data" -e NUXEO_CLID=$(vault kv get -field=clid secret/nuxeo) -e CYPRESS_FV_USERNAME -e CYPRESS_FV_PASSWORD -d me/nuxeo-dev
```
### Step 3:
Run the initial backend setup script in a new terminal once the backend server has started:

```
bash ./initialsetup.sh
```
Explanation:

1. At this point, you should be able to access http://localhost:8080/nuxeo
2. You can run your UI locally (will point to localhost:8080 by default), or access the UI within the Docker container here: http://localhost:3002/


##########



# Useful commands/common tasks

### List running containers:

```docker ps```

### Log into the container:

```docker exec -it nuxeo-dev /bin/bash```

# Deploy entire back-end application

```

Process for pushing updates to Docker container:

If you are working on a

Inside, execute:

~/bin/nuxeoctl stop
~/bin/nuxeoctl mp-install --accept true /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-*.zip
~/bin/nuxeoctl start

Deploying your changes to 

mvn clean install -pDev && cp FirstVoices-marketplace/target/FirstVoices-marketplace-package-latest.zip ~/Dev/Dependencies/nuxeo_dev_docker2/FirstVoices-marketplace-package-latest.zip && 
nuxeoctl stop && nuxeoctl mp-install --accept /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-latest.zip && nuxeoctl

docker cp FirstVoicesSecurity-3.0.22-SNAPSHOT.jar 2a0e4da6a15c:/opt/nuxeo/server/nxserver/bundles/



docker cp target/FirstVoicesSecurity-3.1.3-SNAPSHOT.jar nuxeo-dev:/opt/nuxeo/server/nxserver/plugins/



nuxeoctl mp-install /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-3.0.1-SNAPSHOT.zip




docker run --name nuxeo_dev --rm -ti -v ~/Dev/Dependencies/nuxeo_dev_docker/plugins:/opt/nuxeo/server/nxserver/plugins -v ~/Dev/Dependencies/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ~/Dev/Dependencies/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -p 8080:8080 -p 8787:8787 -e NUXEO_PACKAGES="nuxeo-dam" -e NUXEO_AUTOMATION_TRACE="true" -e NUXEO_DEV_MODE="true" -e NUXEO_CUSTOM_PARAM="fv.contextPath=app" -e NUXEO_DATA="/opt/nuxeo/ext_data" -e NUXEO_CLID="c51f6c87-424a-4e78-9c36-33d10881156b.1885507140.K80rAxQhht7l63UrK7LhK06oovRHsne7kBVyunW5n1MhIydh+LNkN70RJY0pPNkVuBE5wIFVbs0EdJDbXnumwQzBfWu56JyLnpXYkWGGeprtyJum0SDGr75MDiNLc\/ckSMwY4HghlzrLVBI3efI+P5I+v9azNIuE8GCUG8n0kSktnkYBih52n+tggn6rlfA6cqQC8iTiw1uQtHo+3EPpyIg\/55hEhJMoGH+woJdOXpnIvg1UeZFc7X8yWf\/tQ4xFQ75fCtrfK013zdQ56l6liQPk9lKh8ZKn2I3RCLvHCvR+OkJ72GyW5pptP29xnRnj8RekMMno5VPocbkDM3EJ2Q==--b7186ce2-efe0-412b-988e-f4f105695669" -d me/fv-docker




### Configure

Set the context path in /etc/nuxeo/nuxeo.conf
For your local environment, this can be an empty string.

If you want to run the UI at /nuxeo/app, configure it to be `app`

```
fv.contextPath=
```

Start the container:
```
docker start nuxeo_dev
```

SSH into the container:
```

```





### Using Tomcat distribution

Download Nuxeo 10.10 and install:

```
https://maven.nuxeo.org/nexus/service/local/repositories/public-releases/content/org/nuxeo/ecm/distribution/nuxeo-server-tomcat/10.10/nuxeo-server-tomcat-10.10-full.zip
```

Do NOT install the nuxeo-web-ui package, install headless.

## Configure

Set the context path in nuxeo.conf
For your local environment, this can be an empty string. If you want to run the UI at /nuxeo/app, configure it to be `app`

```
fv.contextPath=
```

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





**** FROM OTHER README ****


### Using Docker

You must have Docker installed as a prerequisite for this method.

Get and run the Nuxeo container with a local directory bound to a temp directory on the server:
```
docker run --name nuxeo_dev -d -v ~/Dev/Dependencies/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -p 8080:8080 -d nuxeo
```



nuxeoctl mp-install /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-3.0.1-SNAPSHOT.zip

~/bin/nuxeoctl stop
~/bin/nuxeoctl register
~/bin/nuxeoctl mp-install /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-VERSION-SNAPSHOT.zip
~/bin/nuxeoctl start


docker run --name nuxeo_dev --rm -ti -v ~/Dev/Dependencies/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ~/Dev/Dependencies/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -p 8080:8080 -p 8787:8787 -e NUXEO_PACKAGES="nuxeo-dam" -e NUXEO_AUTOMATION_TRACE="true" -e NUXEO_DEV_MODE="true" -e NUXEO_CUSTOM_PARAM="fv.contextPath=app" -e NUXEO_DATA="/opt/nuxeo/ext_data" -e NUXEO_CLID="123" -d me/fv-docker




### Configure

Set the context path in /etc/nuxeo/nuxeo.conf
For your local environment, this can be an empty string.

If you want to run the UI at /nuxeo/app, configure it to be `app`

```
fv.contextPath=
```

Start the container:
```
docker start nuxeo_dev
```

SSH into the container:
```

```





### Using Tomcat distribution




apt-get update
apt-get install nano

a2enmod headers rewrite proxy proxy_http && service apache2 restart
















To get the remote (AWS) development environment:



For FPCC staff:

What you need?

* Access to AWS (see https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_ECS.html)
* Docker installed locally
* An IDE of your choice (IntelliJ)
* The following dependencies installed.

AWS ECR (Elastic Cloud Registry) manages docker images in our stack.
These images can be used to run the latest Dev environment locally.

Step 1:

First, authenticate using Docker (https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth):
```
aws ecr get-login --region ca-central-1 --no-include-email
```
Copy, paste and run the returned result in terminal.

Step 2:
You can pull the latest development image from AWS, do this:
```
docker pull 482366472492.dkr.ecr.ca-central-1.amazonaws.com/firstvoices:latest
```

At this point, you should have the Docker image available to be built locally.

Note: To find the description of the `latest` Dev image, in case the URL above changes, do the following:
```
aws ecr describe-images --repository-name firstvoices --image-ids imageTag=latest --query 'sort_by(imageDetails,& imagePushedAt)[-1]'
```

Step 3:
You can now build and remote into the Docker image, like so:
```
sudo docker run --entrypoint "/bin/bash" -t -i -p 80:80 482366472492.dkr.ecr.ca-central-1.amazonaws.com/firstvoices:latest
```

docker run --name nuxeo-dev --rm -ti -v ~/Dev/Dependencies/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ~/Dev/Dependencies/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -v ~/Dev/Dependencies/nuxeo_dev_docker/logs:/var/log/nuxeo -p 8080:8080 -p 8787:8787 -p 3002:3001 -e NUXEO_PACKAGES="nuxeo-dam" -e NUXEO_AUTOMATION_TRACE="true" -e NUXEO_DEV_MODE="true" -e NUXEO_DATA="/opt/nuxeo/ext_data" -d nuxeo-dev

## TODO
1. Use `docker-compose` to setup apache2, Elasticsearch, and Postgresql
2. Create a script for optionally scaffolding data
3. Create a script for optionally auto-loading mock data
4. Figure out how to hot-reload into a docker container (potentially tied into IntelliJ)

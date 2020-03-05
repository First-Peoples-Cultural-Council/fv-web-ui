# Docker development environment (meant for localhost work)

This environment is setup for localhost work. It includes an embedded database (Derby), and embedded Elasticsearch.

## Prerequisites

1. You must have Docker installed and running, as well as git installed. Docker can be downloaded from [this link](https://docs.docker.com/install/) and git can be downloaded from [this link](https://git-scm.com/downloads). You will also need the following dependencies:
- Java 8
- [Apache Maven](https://maven.apache.org/)
- Node v8.10.0
- NPM v5.6.0.
2. Basic knowledge of Docker, Nuxeo and bash.
3. Ensure you have the two environment variables set for CYPRESS_FV_USERNAME and CYPRESS_FV_PASSWORD which will be passed into the container and used to create an admin account during the initial setup. After setting environment variables they can be checked by running the following in your terminal window:
```
printenv
```

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
docker run --name nuxeo-dev --rm -ti -p 8080:8080 -v ${PWD}/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ${PWD}/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -v ${PWD}/nuxeo_dev_docker/logs:/var/log/nuxeo -e NUXEO_PACKAGES="nuxeo-dam nuxeo-jsf-ui" -e NUXEO_URL="http://localhost:8080" -e CYPRESS_FV_USERNAME -e CYPRESS_FV_PASSWORD me/nuxeo-dev
```

If you used Option B:
```
docker run --name nuxeo-dev --rm -ti -p 8080:8080 -v ~/Dev/Dependencies/nuxeo_dev_docker:/opt/nuxeo/server/nxserver/tmp -v ~/Dev/Dependencies/nuxeo_dev_docker/data:/opt/nuxeo/ext_data -v ~/Dev/Dependencies/nuxeo_dev_docker/logs:/var/log/nuxeo -e NUXEO_PACKAGES="nuxeo-dam nuxeo-jsf-ui" -e NUXEO_URL="http://localhost:8080" -e CYPRESS_FV_USERNAME -e CYPRESS_FV_PASSWORD me/nuxeo-dev
```

This may take a few minutes as Nuxeo starts up.
The initial backend setup script should automatically run, which will create the proper data structure and an admin account using the environment variables.

If you want to rerun the initial setup script for any reason, you can do so by running the following command from the docker directory:

```
./initialsetup.sh
```

Notes:
* To expose remote debugging via port 8787: ```-p 8787:8787```\
* To include automation traces: ```-e NUXEO_AUTOMATION_TRACE="true"```\
* To enable Dev mode: ```-e NUXEO_DEV_MODE="true"```\
* To change the data folder: ```-e NUXEO_DATA="/opt/nuxeo/ext_data"```\

### Step 4:

* You can now access the FirstVoices backend by going to localhost:8080 and logging in.
* You can also [run the frontend independently](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend)

## Creating an archive to work in
By default, your instance will not have any archives to work in.
You will need to create a language family, language and dialect (i.e. archive).

##### Premade dev language:
From the frontend directory run the command ```npm run local:language:setup``` to create a premade DevLangOne language which contains some words, phrases, and an alphabet.
You can remove this premade language by running the command ```npm run local:language:teardown```.

##### Manually:
Log into the backend, navigate to Workspace (top menu) -> FV -> Workspaces -> Data and create a Language Family, a Language and a Dialect (by clicking "New" in each view). You will then be able to work within that archive via the front end.

## Pushing Changes
After making a change to a Nuxeo module, you can deploy your change to the docker container in two ways:

### Method 1 (deploy entire ZIP - recommended for changes in multiple modules):

* Build the project at ```fv-web-ui```
* Copy ```FirstVoices-marketplace/target/FirstVoices-marketplace-package-latest.zip``` to your mounted directory (e.g. in Option A: ```docker/nuxeo_dev_docker```
* Execute the following command to stop the server, install the package and start the server:
```
docker exec nuxeo-dev /bin/bash -c "nuxeoctl stop && nuxeoctl mp-install --accept=yes /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-latest.zip && nuxeoctl start"
```

### Method 2 (deploy a single module):
#### Easy Way:
* From the root of your module run the command ```./UpdateModule.sh```. If you are creating a new module you will need to copy the UpdateModule.sh script from another module into the root of your module
(eg: copy ```/FirstVoicesData/UpdateModule.sh``` into ```/YourNewModule```).

* Alternatively navigate to ```docker/``` and run the command ```./UpdateModuleMain.sh <ModuleName>``` where ```<ModuleName>``` is the name of the module you have created/made changes to (eg: ```./UpdateModuleMain.sh FirstVoicesData```).
  
  Both of the above will build the module, remove any old copies inside of the docker container, copy the new jarfile into the docker container, and restart the nuxeo backend to deploy the changes/module.
#### Manual method:
* Ensure you remove any old versions of the module inside of the docker container that match the module you want to deploy.
To do this you can run the command ```docker exec nuxeo-dev sh -c 'rm /opt/nuxeo/server/nxserver/bundles/<ModuleName>-*.jar'``` 
* Navigate into the module you changed (e.g. FirstVoicesSecurity) and build it with the command: ```mvn clean install```
This will generate a jarfile for the module in the target directory (e.g. FirstVoicesSecurity/target/FirstVoicesSecurity-*.jar).
* Execute the following command to copy the JAR into the running backend docker container, and restart the server to apply the changes:
```
docker cp target/FirstVoicesSecurity-*.jar nuxeo-dev:/opt/nuxeo/server/nxserver/bundles/ && docker exec nuxeo-dev nuxeoctl restart
```

## Useful commands/common tasks/tips

### List running containers:

```docker ps```

### Log into container called 'nuxeo-dev':

```docker exec -it nuxeo-dev /bin/bash```

## Testing

### Tips & Tricks

When setting up unit tests:
* Ensure that all the necessary imports are at the top
* Check that all @Deploy dependencies are set up in the pom.xml, and that the pom.xml
* Make sure that the @PartialDeploy uses FirstVoicesData as its bundle if you are using the DocumentModel


## TODO
1. Use `docker-compose` to optionally setup Apache2, Elasticsearch, and Postgresql
2. Add additional requirements such as FFMPEG and CCExtractor to image.
3. Figure out how to hot-reload into a docker container (potentially tied into IntelliJ). See https://doc.nuxeo.com/nxdoc/nuxeo-cli/.

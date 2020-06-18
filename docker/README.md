# Docker Development Environment

This environment is setup for localhost work. It includes:

1. A Nuxeo instance (back-end).
2. A database (either embedded H2 or Postgres)
3. Elasticsearch for caching and search (either embedded or standalone)
4. Optionally, the compiled FirstVoices front-end behind an Apache2 server

## Prerequisites

1. You must have Docker installed and running with at least 4GB of memory allocated to docker (preferrably more), as well as git installed. Docker can be downloaded from [this link](https://docs.docker.com/install/) and git can be downloaded from [this link](https://git-scm.com/downloads).


If you are planning on building the back-end from source, you will also need the following dependencies:

   - Java 8 JDK (jdk 1.8.0_xxx [openjdk recommended](https://openjdk.java.net/install/))
     - Don't forget to set JAVA_HOME to the path to the JDK install
   - [Apache Maven v3.6.3](https://maven.apache.org/)
   - NodeJS v10.19.0 ([node version manager recommended](https://github.com/nvm-sh/nvm))
   - NPM v6.13.4 ([node version manager recommended](https://github.com/nvm-sh/nvm))

2. Basic knowledge of Docker, Nuxeo and bash.

3. Ensure you have two environment variables set for CYPRESS_FV_USERNAME and CYPRESS_FV_PASSWORD which will be passed into the container and used to create an admin account during the initial setup. After setting environment variables they can be checked by running the following in your terminal window: `printenv`

### Before beginning

Clone the fv-web-ui repository and navigate into `fv-web-ui/docker/`. All steps are performed in this directory.

```
git clone https://github.com/First-Peoples-Cultural-Council/fv-web-ui.git
cd ./fv-web-ui/docker
```

---

## Back-End Only Setup (Minimal)

In this setup you will have the back-end of FirstVoices running, and will be able to [run and point the front-end development environment](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend) to this instance.

### Step 1: Run the setup script

Make sure the setup script has execute permissions:
```
chmod +x setup_docker.sh
```

To install the latest snapshot (i.e. unstable) version of FirstVoices locally:
```
./setup_docker.sh
```

You can install the environment with a specific version of FirstVoices like so:
```
./setup_docker.sh --dist=3.4.4
```

Or even with a "release candidate" version:
```
./setup_docker.sh --dist=3.4.4-RC
```

This setup script will:

1. Create a docker image called `nuxeo-dev` for the back-end
2. Create volumes on your host machine (in `fv-web-ui/docker/nuxeo_dev_docker`). These will be mounted on the `nuxeo-dev` container.

*Note*: You can build and deploy any version of the FirstVoices package after the environment is setup as specified in [Development Procedures -> Pushing Changes -> Method 1](#method-1-deploy-entire-zip---recommended-for-changes-in-multiple-modules).

### Step 2: Startup the environment

Run the following in terminal:

```
docker-compose up --remove-orphans
```

This command will:

1. Start all the docker services defined in docker-compose.yml (this may take a few minutes as the environment starts up.)
2. Automatically execute `./initialsetup.sh` which will create the proper data structure and an admin account using the environment variables.

**Note for Windows environments:** You may need to replace `${PWD}` in docker-compose.yml with your full path to your `fv-web-ui/docker/` directory, since `${PWD}` will not work in Windows terminals.

### Step 3: Access your URLs

- You can now access the FirstVoices backend by going to localhost:8080 and logging in with the username and password you set for CYPRESS_FV_USERNAME / CYPRESS_FV_PASSWORD
- You can also [run the frontend independently](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend), which will point to your local docker container.

**Your FirstVoices instance will start out empty. Go to the `Getting Started` section to learn how to create a new language.**

---

## Full Setup (Back-end, Front-end, and Related Services)

You can use docker to have a self-contained environment with both the front-end and back-end of FirstVoices for testing of other components. Please review the "Back-End Only Setup" above to gain some insight into the various steps. The following instructions supplement those steps.

This setup is much closer to a production environment. It required more resources, and can be used to test more advanced components.

### Step 1: Run the setup script, including the front-end image:

```
./setup_docker.sh --frontend
```

In addition to the back-end instructions, with this argument the setup script will create a docker image called `nuxeo-dev` for the front-end.

### Step 2: Startup the environment

Run the following in terminal:

```
docker-compose -f docker-compose.yml -f docker-compose.full.yml up
```

In addition to the back-end instructions, with this argument docker will:

1. Build the front-end
2. Setup Postgresql and Elasticsearch in seperate containers
2. Setup apache2 web server to serve the front-end static files

### Step 3: Access your URLs

- You can now access the FirstVoices frond-end by going to localhost:3001 and logging in with the username and password you set for CYPRESS_FV_USERNAME / CYPRESS_FV_PASSWORD

**Your FirstVoices instance will start out empty. Go to the `Getting Started` section to learn how to create a new language.**

---

## Getting Started

At this point you should have either the back-end running independently, [with the front-end pointing to it](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend); or the back-end and front-end running together using docker.

By default, your instance will not have any archives to work in. You are ready to setup your first archive on FirstVoices! In order to do so, you will need to create a language family, language and dialect (i.e. archive) in the back-end.

You have two options:

1. Log into the backend, navigate to Workspace (top menu) -> FV -> Workspaces -> Data and create a Language Family, a Language and a Dialect (by clicking "New" in each view). You will then be able to work within that archive via the front end.

2. You can use our `demo` language. From the frontend directory run the command `npm run local:language:setup` to create a language called "DevLangOne" language which contains some words, phrases, and an alphabet. You can remove this demo language by running the command `npm run local:language:teardown`.

You should now see your new FirstVoices language archive when you access the front-end!

---

## Other Setup Notes and Configuration Options

These are not required for getting started, but contain some useful information if you wish to modify the environment for your needs.

### Private Docker Configuration keys 
If you need to reference external servers, or include other private dev information in your build, you can do so in a special docker-compose yml file that will be ignored by source control - docker-compose.private.yml
To see an example of what this file might look like for AWS Cognito configuration, view docker-compose.private.sample.yml

You can use this docker file by appending it:
```
docker-compose -f docker-compose.yml -f docker-compose.private.yml up
```

### Allotting enough resources to Docker

Make sure your Docker Environment (e.g. [Docker engine on Mac](https://docs.docker.com/docker-for-mac/space/)) has enough memory. Elasticsearch [recommends 4 GB](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html) at the very least.

### Clearing your existing containers and dealing with cache
- The easiest way to clear all your docker related assets and `start from scratch` is to run `./teardown_docker.sh`.
- If you encounter issues with remaining artifacts from previous runs, [you can clear some of those](https://github.com/moby/moby/issues/23371#issuecomment-224927009). Remember that these commands will clear ALL your docker artifacts, not just ones created as part of this project.
- If you wish to build a docker image with no cache (force a rebuild), add the `--no-cache` flag.

### Manually running the initial setup script

This should not be required, but if you need to run it manually, you can do so by running the following command from the docker directory:

```
./initialsetup.sh
```

### Additional Nuxeo Docker configuration

You can specify additional options on the nuxeo (back-end) docker container in docker-compose.yml, under nuxeo -> environment. For example:

- To include automation traces change `NUXEO_AUTOMATION_TRACE=true`
- To enable Dev mode: `NUXEO_DEV_MODE=true`
- To change the data folder: `NUXEO_DATA=/opt/nuxeo/ext_data`

For additional options, consult: https://hub.docker.com/_/nuxeo

### Cypress (testing) Containers

You can use docker to setup an environment to run Cypress tests against. First, setup docker for the Full Setup (see above). Then, start it up and run tests:

```
docker-compose -f docker-compose.yml -f docker-compose.full.yml -f docker-compose.cypress.yml up --abort-on-container-exit
```

---

### Postgres

You can access the Postgres database, run `docker exec -it <CONTAINER ID> psql -U nuxeo_admin nuxeo`, where `<CONTAINER ID>` is the container id of postgres. Run `docker ps` to list running containers.

## Development Procedures

### Pushing Changes

After making a change to a Nuxeo module, you can deploy your change to the docker container in two ways:

#### Method 1 (deploy entire ZIP - recommended for changes in multiple modules):

To build the entire project and deploy it to your local container, run:
```
./docker/UpdatePackage.sh
```

You can skip tests by using the `-skip-tests` flag.


#### Method 2 (deploy a single module):

- From the root of your module run the command `./UpdateModule.sh`. If you are creating a new module you will need to copy the UpdateModule.sh script from another module into the root of your module
  (eg: copy `/FirstVoicesData/UpdateModule.sh` into `/YourNewModule`).

      Optionally you can add the flag ```-skip-tests``` to skip the compilation and running of unit tests during the module deploy (eg: ```./UpdateModule.sh -skip-tests```).

- Alternatively navigate to `docker/` and run the command `./UpdateModuleMain.sh <ModuleName>` where `<ModuleName>` is the name of the module you have created/made changes to (eg: `./UpdateModuleMain.sh FirstVoicesData`).

  Both of the above will build the module, remove any old copies inside of the docker container, copy the new jarfile into the docker container, and restart the nuxeo backend to deploy the changes/module.

### Useful commands/common tasks/tips

#### List running containers:

`docker ps`

#### Log into container called 'nuxeo-dev':

`docker exec -it nuxeo-dev /bin/bash`

---

## Testing Procedures

### Tips & Tricks

When setting up unit tests:

- Ensure that all the necessary imports are at the top
- Check that all @Deploy dependencies are set up in the pom.xml, and that the pom.xml
- Make sure that the @PartialDeploy uses FirstVoicesData as its bundle if you are using the DocumentModel

Errors:

- If you encounter 137 or similar errors with docker you may need to allocate more memory for the containers to use.

---

## TODO

1. Add additional requirements such as FFMPEG and CCExtractor to image.
2. Figure out how to hot-reload into a docker container (potentially tied into IntelliJ). See https://doc.nuxeo.com/nxdoc/nuxeo-cli/.
3. Modify script for handling multiple RC versions. Ensure case sensitive.
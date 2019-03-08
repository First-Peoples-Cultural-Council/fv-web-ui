# FirstVoices Web Applciation #

This is a responsive dictionary web-application for the FirstVoices language assets that uses [Nuxeo ECM](http://www.nuxeo.com/) as a back-end.

## Stack ##
This web app is built using the following:

-  [ReactJS](https://facebook.github.io/react/)
-  [Webpack](https://webpack.github.io/)
-  [Material-UI](https://github.com/callemall/material-ui)
-  [Nuxeo-js-client](https://github.com/nuxeo/nuxeo-js-client)

And interfaces with a [Nuxeo](http://www.nuxeo.com) server, at the moment using custom schemas and configruation specific to FirstVoices.

For additional dependencies see package.json.

## Getting Started ##
There are several version dependency requirements to properly build and run the project:
-  NodeJS>=v8.10
-  Yarn v1.5.1 or NPM v5.6.0

Instructions to install specific project dependencies and running the application are described in the *Setting Up and Running* section.

Mac OS X is the ideal environment for running and developing the FirstVoices Web Application. The steps below are instructions for downloading project dependencies and building the project using Terminal on Mac OS X.

### Setting Up and Running ###
Perform the steps below to setup your environment and run the FirstVoices Web Application on Mac OS X.

1. Install [Homebrew](https://brew.sh/) by following the instructions found on the [Homebrew](https://brew.sh/) home page.

2. Use [Homebrew](https://brew.sh/) to install [NVM](http://nvm.sh) by running:
```bash
$ brew update
$ brew install nvm
$ mkdir ~/.nvm
```
Configure NVM by adding the following entry to your `~/.bash_profile` file:
```
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```
Activate and verify your new `~/.bash_profile` entry by running:
```bash
$ source ~/.bash_profile
$ echo $NVM_DIR
```

3. Clone this repository and navigate into the `fv-web-ui` directory:
```bash
$ git clone https://github.com/First-Peoples-Cultural-Council/fv-web-ui.git
$ cd fv-web-ui
```

4. Install NodeJS v8.10.0 and set it as the active version of NodeJS by running:
```bash
$ nvm install 8.10.0
$ nvm use 8.10.0
```

5. Install Yarn v1.5.1 by running:
```bash
$ npm install -g yarn@1.5.1
```

6. To successfully run Yarn, you need to configure your `~/.ssh/config` file so that Yarn knows which RSA Key to use when cloning GitHub repositories. If you don't have an RSA Key [generate](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) one and [add](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) it to your GitHub account. Create a `~/.ssh/config` file if it does not already exist. Add the following entry to your `~/.ssh/config` file while replacing `<mykey>` as needed:
```
# Github RSA Key
Host github.com
    UseKeychain yes
    AddKeysToAgent yes
    IdentityFile ~/.ssh/<mykey>_rsa
```

7. Run Yarn to download `node_modules` dependencies by running:
```bash
$ yarn
```
Important Note: when running Yarn for the first time you will be silently prompted to enter the Key Phrase for the RSA Key you added to the `~/.ssh/config` file. If progress halts and a small `lock icon` appears, enter your RSA Key Phrase to proceed. If you recieve an error when running Yarn you may need to close your terminal and try running it again.

8. Start the dev server:
```bash
$ yarn run start
```

9. Building development files (used for debugging development build files)
```bash
$ yarn run development
```

10. Visit [localhost:3001](http://localhost:3001) in your web browser to view the FirstVoices Dictionary Prototype app.


## Building for Production ##
You can build for production after completing the steps found in the *Setting Up and Running* section above.

1. Run the following command to build for production:
```
$ yarn run production
```
2. Copy the generated files in `/public` folder to your webserver.

*Note:* Remember to configure your web application to rewrite all requests to the root path, in order for Push State to work.

## Contributing ##

### Adding New Dependencies
Install dependencies using `yarn add package` or `yarn add package --dev`

### Tips
* Learn how to work with [React.js](https://facebook.github.io/react/docs/getting-started.html)
* Get familiar with [ES2015](https://babeljs.io/docs/learn-es2015/) syntax

## Testing ##

We use BroswerStack in order to ensure our UI functions in the latest version of all major browsers, and at least 1 version back depending on demand from our users. We will be posting a more detailed and up-to-date compatibility status in the future.

<a href="https://www.browserstack.com" target="_blank"><img src="app/assets/images/browserstack-logo-600x315.png?raw=true" width="160" alt="BrowserStack" /></a>

## Switching Targets for test purposes ##
Note: local.json is where you change the target you run against.
Location: <your-front-end-work-directory>/app/assets/javascript/configuration/local.json

For running aginst local server configure to
"baseWebUIURL":"http://localhost:3001/"
"baseURL":"http://localhost:8080/nuxeo/"


## Licensing ##

The data and code in this repository is licensed under multiple licenses.

- All code in the /app directory is licensed under the Apache License 2.0. See LICENSE.

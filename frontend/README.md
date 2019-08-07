# FirstVoices Web Applciation

This is a responsive dictionary web-application for the FirstVoices language assets that uses [Nuxeo ECM](http://www.nuxeo.com/) as a back-end.

## Stack

This web app is built using the following:

- [ReactJS](https://facebook.github.io/react/)
- [Webpack](https://webpack.github.io/)
- [Material-UI](https://github.com/callemall/material-ui)
- [Nuxeo-js-client](https://github.com/nuxeo/nuxeo-js-client)

And interfaces with a [Nuxeo](http://www.nuxeo.com) server, at the moment using custom schemas and configruation specific to FirstVoices.

For additional dependencies see package.json.

## Getting Started

There are several version dependency requirements to properly build and run the project:

- NodeJS>=v8.10 (10.15.3)
- NPM v5.6.0

Instructions to install specific project dependencies and running the application are described in the _Setting Up and Running_ section.

Mac OS X is the ideal environment for running and developing the FirstVoices Web Application. The steps below are instructions for downloading project dependencies and building the project using Terminal on Mac OS X.

### Setting Up and Running

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

5. To successfully run NPM, you need to configure your `~/.ssh/config` file so that NPM knows which RSA Key to use when cloning GitHub repositories. If you don't have an RSA Key [generate](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) one and [add](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) it to your GitHub account. Create a `~/.ssh/config` file if it does not already exist. Add the following entry to your `~/.ssh/config` file while replacing `<mykey>` as needed:

```
# Github RSA Key
Host github.com
    UseKeychain yes
    AddKeysToAgent yes
    IdentityFile ~/.ssh/<mykey>_rsa
```

6. Run npm to download `node_modules` dependencies by running:

```bash
$ npm install
```

Important Note: when running 'npm install' for the first time you will be silently prompted to enter the Key Phrase for the RSA Key you added to the `~/.ssh/config` file. If progress halts and a small `lock icon` appears, enter your RSA Key Phrase to proceed. If you recieve an error when running 'npm install' you may need to close your terminal and try running it again.

7. Assuming you have a local instance of a Nuxeo server running on localhost:8080, you can start the dev server:

```bash
$ npm run start
```

If you don't have a local Nuxeo instance, you can point the front-end to a different Nuxeo instance like so:

```bash
$ npm run start -- --env.NUXEO_URL="https://FV_DEV_NUXEO_HOST/nuxeo/"
```

If you are running the app locally on localhost:3001 (the default) with no context path, you can make sure absolute URLs point to the correct links like so:

```bash
$ npm run start -- --env.NUXEO_URL="https://FV_DEV_NUXEO_HOST/nuxeo/" --env.WEB_URL="http://localhost:3001/"
```

If you are in a situation where you need a context path (e.g. /nuxeo/app) for your front-end, you can configure one like so:

```bash
$ npm run start -- --env.NUXEO_URL="https://FV_DEV_NUXEO_HOST/nuxeo/" --env.WEB_URL="http://localhost:3001/"  --env.CONTEXT_PATH="/nuxeo/app"
```

8. Building development files (used for debugging development build files)

```bash
$ npm run development
```

9. Visit [localhost:3001](http://localhost:3001) in your web browser to view the FirstVoices Dictionary Prototype app.

## Building for Production

You can build for production after completing the steps found in the _Setting Up and Running_ section above.

1. Run the following command to build for production:

```
$ npm run production
```

2. Copy the generated files in `/public` folder to your webserver.

_Note:_ Remember to configure your web application to rewrite all requests to the root path, in order for Push State to work.

## Contributing

### Adding New Dependencies

Install dependencies using `npm install --save` or `npm install --save-dev`

### Tips

- Learn how to work with [React.js](https://facebook.github.io/react/docs/getting-started.html)
- Get familiar with [ES2015](https://babeljs.io/docs/learn-es2015/) syntax

## Testing

We use BroswerStack in order to ensure our UI functions in the latest version of all major browsers, and at least 1 version back depending on demand from our users. We will be posting a more detailed and up-to-date compatibility status in the future.

<a href="https://www.browserstack.com" target="_blank"><img src="app/assets/images/browserstack-logo-600x315.png?raw=true" width="160" alt="BrowserStack" /></a>

### Frontend: End to end testing

Via [Cypress](https://www.cypress.io/)

Launch the Cypress app:

```
$ npm run test:e2e
```

### Frontend: Unit testing

Via [Jest](https://jestjs.io/)

Run tests once:

```
$ npm run test
```

Watch mode, tests rerun after save:

```
$ npm run test:watch
```

Runs tests and generates a test coverage report

```
$ npm run test:coverage
```

## Switching Targets for test purposes

If you need to point your UI at a different NUXEO instance for whatever reason, modify the return value for `getBaseURL` in `NavigationHelpers`.

## Git Hooks

Git hooks are validating the frontend code on commit.

You can skip the commit checks by adding the `--no-verify` flag to a `git commit`, eg:

`git commit -m 'pull update & conflict resolution' --no-verify`

[Husky](https://github.com/typicode/husky) runs the `pre-commit` hooks for us.

Configure Husky in `package.json`, for example:

```
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
```

[lint-staged](https://github.com/okonet/lint-staged) runs linters against staged git files.

Configure lint-staged in `package.json`, for example:

```
  "lint-staged": {
    "linters": {
      "*.{json,css,md}": [
        "npm run lint-staged:prettier",
        "git add"
      ],
      "*.js": [
        "npm run lint-staged:eslint",
        "npm run lint-staged:prettier",
        "npm run lint-staged:test",
        "git add"
      ]
    },
    "ignore": [
      "/build/",
      "/cypress/",
      "**/__tests__/"
    ]
  },
```

[ESLint](https://eslint.org/) is checking the code

Please adjust the rules to suit your preference.

Configure ESLint in `.eslintrc`.

For example, downgrading a rule to a warning instead of an error.

## Structuring a component

A standardized structure should make it easier to work on other people's components. When creating new components please try to follow this structure:

```
// 1) Group imports first

import React, { Component, PropTypes } from 'react' 

// 1a) ^ Using old version of React/PropTypes. 
// Newer releases have standalone PropTypes lib/import

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { someActionForRedux } from 'providers/redux/reducers/someExample'

// 2) Then extract anything from imports

const { func, object } = PropTypes

// 3) A component will have 2 exports. The 1st is the component not wrapped in a provider.
// We could use this export when testing since it allows us to easily mock up Redux data/actions.

export class ExampleComponent extends Component {

    // 4) propTypes before defaultProps. 
    // Seeing propTypes first gives an overview of all that is in play.

    static propTypes = {
        somethingFromParent: object,

        // 5) Grouping Redux related data/fn() under a comment helps to differentiate them from parent props

        // REDUX: reducers/state
        someDataFromRedux: object.isRequired,
        // REDUX: actions/dispatch/func
        someActionForRedux: func.isRequired,
    }
    
    // 6) defaultProps should be added only as needed, no need for 1:1 mapping between propTypes & defaultProps

    static defaultProps = {
        somethingFromParent: {},
    }
    
    state = {}

    // 7) ^ If using a function to set initial state it will need to be defined before, eg:
    // _getInitialState = () => {}
    // state = this._getInitialState()

    // 8) component lifecyle methods before render()

    render() {}

    // 9) All remaining component functions after render()
    
    // 10) If 'fat arrow' syntax is used for function definitions, we won't need to bind `this` in the constructor
    
    anotherFunction = () => {return this._getInitialState()}

}


// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { someRootLevelNamespace } = state

  const { someDataFromRedux } = someRootLevelNamespace

  return {
    someDataFromRedux,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  someActionForRedux,
}

// 11) Thee default export is a Redux wrapped component.
// This export is intended to be used by the app.

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExampleComponent)
```

## Licensing

The data and code in this repository is licensed under multiple licenses.

- All code in the /app directory is licensed under the Apache License 2.0. See LICENSE.

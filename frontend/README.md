# FirstVoices Front-end

## Getting Started

There are several version dependency requirements to properly build and run the project:

- NodeJS v10.19.0
- NPM v6.13.4

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

3. Clone this repository and navigate into the `fv-web-ui/frontend` directory:

```bash
$ git clone https://github.com/First-Peoples-Cultural-Council/fv-web-ui.git
$ cd fv-web-ui/frontend
```

4. Install NodeJS v10.19.0 and set it as the active version of NodeJS by running:

```bash
$ nvm install 10.19.0
$ nvm use 10.19.0
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
$ npm ci
```

Important Note: when running 'npm ci' for the first time you will be silently prompted to enter the Key Phrase for the RSA Key you added to the `~/.ssh/config` file. If progress halts and a small `lock icon` appears, enter your RSA Key Phrase to proceed. If you recieve an error when running 'npm install' you may need to close your terminal and try running it again.

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

### Frontend: End to end testing (Via [Cypress](https://www.cypress.io/))

These Cypress tests require that you have java and maven installed as well as the correct environment variables set for the following:

For the database setup scripts and for local backend user login:
```
CYPRESS_FV_USERNAME
CYPRESS_FV_PASSWORD
```

For recording runs to [the Cypress dashboard](https://dashboard.cypress.io/projects/gdqzxg/runs) (optional and not recommended when creating new tests):
```
CYPRESS_PROJECT_ID
CYPRESS_RECORD_KEY
```

To run tests locally startup a local backend (see [this link](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/docker) for details).

Launch the Cypress app (GUI) where you can run tests individually (recommended for creating new tests):

```
$ npm run test:e2e:local
```

Launch the full Cypress test suite headlessly (will record the runs to [the dashboard](https://dashboard.cypress.io/projects/gdqzxg/runs) if the environment variables are set):
```
$ npm run test:e2e:local:headless
```
With debugging output enabled:
```
$ npm run test:e2e:local:headless:debug
```

#### Creating Cypress tests
The first thing to do when creating Cypress tests is to figure out if your test will need to create or change any backend data. If it does then you will need to use an existing test language or create a new one.

The following table shows the tests languages and how the current tests use them. If you can fit your new test in without disrupting existing tests please do so, otherwise use a new test language.

| Items in use ->   |   Words  |  Phrases |   Songs  |  Stories |  Portal  | Books       | Other              | Language starts as: | Any item state change |
|-------------------|:--------:|:--------:|:--------:|:--------:|:--------:|-------------|--------------------|---------------------|:---------------------:|
| TestLanguageOne   | &#x2713; | &#x2713; | &#x2713; | &#x2713; | &#x2713; |             | Recorder           | Enabled             |        &#x2713;       |
| TestLanguageTwo   | &#x2713; | &#x2713; |          |          |          | Phrasebooks | Contributor, Media | Published           |        &#x2713;       |
| TestLanguageThree | &#x2713; | &#x2713; | &#x2713; | &#x2713; |          |             | Recorder           | Enabled             |        &#x2713;       |
| TestLanguageFour  | &#x2713; | &#x2713; | &#x2713; | &#x2713; |          |             |                    | Published           |        &#x2713;       |
| TestLanguageFive  | &#x2713; | &#x2713; |          |          |          |             | Reports            | Published           |        &#x2713;       |
| TestLanguageSix   | &#x2713; | &#x2713; | &#x2713; |          |          |             | Alphabet           | Published           |        &#x2713;       |
| TestLanguageSeven |          |          |          | &#x2713; | &#x2713; | Story Books |                    | Enabled             |                       |

When you create a new test please update this table.

##### Creating new data:
To create new data for use in tests you will have to add to the script located at [/frontend/scripts/TestDatabaseSetup.sh](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/blob/master/frontend/scripts/TestDatabaseSetup.sh) using the batch import tool, utils tool, and API endpoints, as needed.
The script contains examples of how to do each of these, which can be copied with slight name changes. CSV files can be placed in the [/frontend/scripts/files directory](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend/scripts/files).

For any new languages you are creating in the setup script please ensure they are removed in the corresponding [/frontend/scripts/TestDatabaseTeardown.sh](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/blob/master/frontend/scripts/TestDatabaseTeardown.sh) script.

##### Writing the Cypress tests:
Cypress tests should be placed in the frontend directory beside the thing that is being tested, in its own directory named "\_\_cypress\_\_". An example test can be seen [at this link](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/blob/master/frontend/app/assets/javascripts/views/pages/explore/dialect/learn/phrases/__cypress__/MemberView-Phrase.js). 
On startup tests will be copied from the project and placed in the [/frontend/cypress/integration/\_\_cypress\_\_](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend/cypress/integration__cypress__) where they will be run from.

A list of Cypress commands can be found on their website [at this link](https://docs.cypress.io/api/api/table-of-contents.html).

We are also using a few libraries to extend the functionality of Cypress. The documentation for those libraries can be found at: [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro) and [Cypress DOM Testing Library](https://testing-library.com/docs/dom-testing-library/api-queries).

Custom Cypress commands can be created in the [/frontend/cypress/support/commands.js](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/blob/master/frontend/cypress/support/commands.js) file.

Resources for use in testing should be placed in the [/frontend/cypress/fixtures](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend/cypress/fixtures) directory.

The [/frontend/cypress/plugins](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend/cypress/plugins) folder holds plugins which are a “seam” for you to write your own custom code that executes during particular stages of the Cypress lifecycle.

Videos and screenshots created by the tests will be placed in the corresponding screenshots and videos directories inside of the [/frontend/cypress/](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend/cypress) directory which will be created as needed automatically.

The Cypress tests are copied through the ```npm run cy:copy``` command (which is automatically run with ```npm run test:e2e:local``` and ```npm run test:e2e:local:headless```). \
Note: changes to tests aren’t watched so if you have the Test Runner launched and you edit a test, you will need to run npm run cy:copy to move the tests to [/frontend/cypress/integration/\_\_cypress\_\_](https://github.com/First-Peoples-Cultural-Council/fv-web-ui/tree/master/frontend/cypress/integration/__cypress__).

##### Additional tips:
Testing for something that doesn’t exist is slow as it will keep checking until it times out (timeout can be customised): 
eg:```cy.queryByText(/stop browsing alphabetically/i).should(‘not.exist’)```

If your tests are failing randomly, a wait command usually fixes things:
```cy.wait(500)```

Some tests will pass locally with no problems, but will fail on slower CI machines. 
The best way to fix this is by adding more ```cy.wait()``` commands to the tests (especially after loading a new page).

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
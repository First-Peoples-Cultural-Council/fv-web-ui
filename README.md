# FirstVoices Dictionary Prototype #
<a rel="Exploration" href="https://github.com/BCDevExchange/docs/blob/master/discussion/projectstates.md"><img alt="Being designed and built, but in the lab. May change, disappear, or be buggy." style="border-width:0" src="http://bcdevexchange.org/badge/2.svg" title="Being designed and built, but in the lab. May change, disappear, or be buggy." /></a>

This is a responsive dictionary web-application for the FirstVoices language assets that uses [Nuxeo ECM](http://www.nuxeo.com/) as a back-end.

## Stack ##
This web app is built using the following:

-  [ReactJS](https://facebook.github.io/react/)
-  [Webpack](https://webpack.github.io/)
-  [Material-UI](https://github.com/callemall/material-ui)
-  [Nuxeo-js-client](https://github.com/nuxeo/nuxeo-js-client)

And interfaces with a [Nuxeo](http://www.nuxeo.com) server, at the moment using custom schemas and configruation specific to FirstVoices.

For additional dependencies see package.json.

This app has been scaffolded using [gulp-starter](https://github.com/vigetlabs/gulp-starter).

## Getting Started ##

You'll need [NodeJS](http://nodejs.org/), and [Git](http://git-scm.com/downloads). Clone this repo from GitHub, change directory to the repo root.

1. Run `npm install -g gulp`.
2. Run `npm install`.
3. Run `gulp` to start a Node server.  Defaults to [localhost:3001](http://localhost:3001).
4. Install [Nuxeo](http://www.nuxeo.com) and setup your server, including enabling [Cross-Origin Resource Sharing (CORS)](https://doc.nuxeo.com/pages/viewpage.action?pageId=14257084).
4. Rename */app/assets/javascripts/configuration/sample.local.json* to *local.json* and update that file.

* On some machines installation of certain modules may not work as part of `npm install`. If that is the case, install missing modules individually (e.g. `npm install imagemin-jpegtran`, after trying to run `gulp`).

## Building for Production ##

In order to build for production:
1. Run `npm install -g gulp`.
2. Run `npm install`.
3. Run `gulp build:production`.
4. Copy generated files in /public folder to your webserver.

Note: Remember to configure your web application to rewrite all requests to the root path, in order for Push State to work.

## Contributing ##

### Adding New Dependencies
1. Install dependency using `npm install package --save` or `npm install package --save-dev`
2. When ready, run `npm shrinkwrap` to lock dependencies.

### Tips
* Learn how to work with [React.js](https://facebook.github.io/react/docs/getting-started.html)
* Get familiar with [ES2015](https://babeljs.io/docs/learn-es2015/) syntax

## Licensing ##

The data and code in this repository is licensed under multiple licenses.

- All code in the /app directory is licensed under the Apache License 2.0. See LICENSE.

- All [gulp-starter](https://github.com/vigetlabs/gulp-starter) code in /gulpfile.js directory is licensed under MIT License (MIT). See gulpfile.js/LICENSE.

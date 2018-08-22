import 'babel-polyfill';

/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { render } from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin';

import ThemeManager from 'material-ui/lib/styles/theme-manager';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';

import ConfGlobal from 'conf/local.json';

// Providers provide reducers and actions
import providers from './providers/index';

// Views
import AppWrapper from 'views/AppWrapper';

require('!style-loader!css-loader!normalize.css');
require('!style-loader!css-loader!alloyeditor/dist/alloy-editor/assets/alloy-editor-ocean-min.css');
require('!style-loader!css-loader!tether-shepherd/dist/css/shepherd-theme-arrows.css');
require('bootstrap/less/bootstrap');
require("styles/main");

injectTapEventPlugin();

const context = {
    providers,
    /*combinedProviders: [
      providers // OK for all providers to share the same store for now, make sure actions are unique
    ],*/
    providedState: {
        properties: {
            title: ConfGlobal.title,
            pageTitleParams: null,
            domain: ConfGlobal.domain,
            theme: {
                palette: ThemeManager.getMuiTheme(FirstVoicesTheme),
                id: 'default'
            }
        }
    }
};

render(<AppWrapper {...context} />, document.getElementById('app-wrapper'));

/*window.addEventListener("unhandledrejection", function(err, promise) {
// handle error here, for example log
});*/

// TODO: https://gist.github.com/Aldredcz/4d63b0a9049b00f54439f8780be7f0d8
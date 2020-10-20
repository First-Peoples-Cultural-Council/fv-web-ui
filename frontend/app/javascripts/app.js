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

import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom' // import ReactDOM from "react-dom"

import ConfGlobal from 'conf/local.js'

// REDUX
import { Provider } from 'react-redux'
import store from 'providers/redux/store'

// Views
import AppWrapper from 'views/AppWrapper'

require('!style-loader!css-loader!normalize.css')
require('bootstrap/less/bootstrap')
require('styles/main')

const context = {
  providedState: {
    properties: {
      title: ConfGlobal.title,
      pageTitleParams: null,
      domain: ConfGlobal.domain,
    },
  },
}

render(
  <Provider store={store}>
    <AppWrapper {...context} />
  </Provider>,
  document.getElementById('app-wrapper')
)

/*window.addEventListener("unhandledrejection", function(err, promise) {
// handle error here, for example log
});*/

// TODO: https://gist.github.com/Aldredcz/4d63b0a9049b00f54439f8780be7f0d8

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
import { render } from 'react-dom'
import ConfGlobal from 'common/conf/local.js'

// REDUX
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'

import rootReducer from 'state/reducers'

import localCache from 'state/middleware/localCache'
import { getConfiguredCache } from 'money-clip'

// Views
import AppWrapper from 'components/AppWrapper'
import Login from 'components/Login'

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
const cache = getConfiguredCache({
  version: ConfGlobal.localCacheVersion,
  maxAge: ConfGlobal.localCacheMaxAge,
})
const localCacheMiddleware = localCache(cache.set)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
cache.get('cache').then((data) => {
  const store = createStore(
    rootReducer,
    {
      cache: data || {},
    },
    composeEnhancers(applyMiddleware(thunkMiddleware, localCacheMiddleware))
  )

  // FW-1922: While this did not show any signs of slowing the page load
  // It may be worth finding a way to avoid using render multiple times
  // https://stackoverflow.com/questions/31302803/is-it-ok-to-use-react-render-multiple-times-in-the-dom
  // https://github.com/facebook/react/issues/12700
  render(
    <Provider store={store}>
      <Login />
    </Provider>,
    document.getElementById('login')
  )
  // Carry on as usual
  render(
    <Provider store={store}>
      <AppWrapper {...context} />
    </Provider>,
    document.getElementById('app-wrapper')
  )
})

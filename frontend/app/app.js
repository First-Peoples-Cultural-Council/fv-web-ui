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
import 'core-js'

import React from 'react'
import { render } from 'react-dom'
import ConfGlobal from 'common/conf/local.js'

// REDUX
import FVProvider from 'components/FVProvider'

// Views
import AppWrapper from 'components/AppWrapper'
import Login from 'components/Login'
// Sentry
import * as Sentry from '@sentry/react'
Sentry.init({
  dsn: 'https://b5b295e690dd4471be88933ec976d12d@o488868.ingest.sentry.io/5550001',
})

import 'normalize.css'
import './assets/stylesheets/main.less'

const context = {
  providedState: {
    properties: {
      title: ConfGlobal.title,
      pageTitleParams: null,
      domain: ConfGlobal.domain,
    },
  },
}

// FW-1922: While this did not show any signs of slowing the page load
// It may be worth finding a way to avoid using render multiple times
// https://stackoverflow.com/questions/31302803/is-it-ok-to-use-react-render-multiple-times-in-the-dom
// https://github.com/facebook/react/issues/12700
render(
  <FVProvider>
    <Login />
  </FVProvider>,
  document.getElementById('login')
)

// Carry on as usual
render(
  <FVProvider>
    <AppWrapper {...context} />
  </FVProvider>,
  document.getElementById('app-wrapper')
)

// A11Y
// const { axe, toHaveNoViolations } = require('jest-axe')
// expect.extend(toHaveNoViolations)
// import ReactDOMServer from 'react-dom/server'

// Standard
import React from 'react'
import ReactDOM from 'react-dom'

// REDUX
import { Provider } from 'react-redux'
import store from 'providers/redux/store'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import FirstVoices from 'views/themes/FirstVoices.js'
import ConfGlobal from 'conf/local.js'

// Views
import AppWrapper from '../AppWrapper'

// require('!style-loader!css-loader!normalize.css')
// require('bootstrap/less/bootstrap')
// require('styles/main')


const createdMuiTheme = createMuiTheme(FirstVoices)
const context = {
  providedState: {
    properties: {
      title: ConfGlobal.title,
      pageTitleParams: null,
      domain: ConfGlobal.domain,
    },
  },
}
describe('AppWrapper', () => {
  test('Mounts', () => {
    // Structure: Arrange
    const container = document.createElement('div')
    ReactDOM.render(
      <Provider store={store}>
        <MuiThemeProvider theme={createdMuiTheme}>
          <AppWrapper {...context} />
        </MuiThemeProvider>
      </Provider>,
      container)

    expect(container.querySelector('#AppWrapper').textContent).toMatch('FirstVoices')
  })

  // test('Accessibility', async() => {
  //   const html = ReactDOMServer.renderToString(<AppWrapper {...context} />)
  //   const results = await axe(html)
  //   expect(results).toHaveNoViolations()
  // })
})

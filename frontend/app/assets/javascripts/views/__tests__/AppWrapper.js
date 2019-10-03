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
import { FirstVoicesThemeV1 as FirstVoicesTheme } from 'views/themes/FirstVoicesTheme.js'
import ConfGlobal from 'conf/local.js'

// Views
import AppWrapper from '../AppWrapper'

// require('!style-loader!css-loader!normalize.css')
// require('bootstrap/less/bootstrap')
// require('styles/main')


const createdMuiTheme = createMuiTheme(FirstVoicesTheme)
const context = {
  providedState: {
    properties: {
      title: ConfGlobal.title,
      pageTitleParams: null,
      domain: ConfGlobal.domain,
      siteTheme: 'default',
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

    expect(container.querySelector('#pageNavigation').textContent).toMatch('SIGN IN')
    expect(container.querySelector('#pageFooter').textContent).toMatch('support@fpcc.ca')

    // Structure: Act
    // Structure: Assert
  })

  // test('Accessibility', async() => {
  //   const html = ReactDOMServer.renderToString(<AppWrapper {...context} />)
  //   const results = await axe(html)
  //   expect(results).toHaveNoViolations()
  // })
})

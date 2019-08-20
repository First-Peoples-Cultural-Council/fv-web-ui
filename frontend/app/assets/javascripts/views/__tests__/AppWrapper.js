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

import ThemeManager from 'material-ui/styles/theme-manager'
import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js'
import ConfGlobal from 'conf/local.js'

// Views
import AppWrapper from '../AppWrapper'

// require('!style-loader!css-loader!normalize.css')
// require('bootstrap/less/bootstrap')
// require('styles/main')

// injectTapEventPlugin()

const context = {
  providedState: {
    properties: {
      title: ConfGlobal.title,
      pageTitleParams: null,
      domain: ConfGlobal.domain,
      theme: {
        palette: ThemeManager.getMuiTheme(FirstVoicesTheme),
        id: 'default',
      },
    },
  },
}
describe('AppWrapper', () => {
  test('Mounts', () => {
    // Structure: Arrange
    const container = document.createElement('div')
    ReactDOM.render(
      <Provider store={store}>
        <AppWrapper {...context} />
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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IntlService from 'views/services/intl'
const intl = IntlService.instance
const { func } = PropTypes
export class Redirector extends Component {
  static propTypes = {
    redirect: func,
  }
  static defaultProps = {
    redirect: () => {},
  }
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.redirect()
  }

  render() {
    return (
      <div style={{ backgroundColor: '#fff', height: '100vh' }}>
        {intl.translate({
          key: 'redirecting',
          default: 'Redirecting',
          case: 'first',
        })}
        ...
      </div>
    )
  }
}

import React, { Component } from 'react'
import NavigationHelpers from 'common/NavigationHelpers'
// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import PropTypes from 'prop-types'
const { func, string } = PropTypes

export class Link extends Component {
  static propTypes = {
    className: string,
    clickHandler: func,
    href: string.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  render() {
    const { className, href } = this.props
    return (
      <a
        className={className}
        onClick={(e) => {
          e.preventDefault()
          NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
        }}
        href={href}
      >
        {this.props.children}
      </a>
    )
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(null, mapDispatchToProps)(Link)

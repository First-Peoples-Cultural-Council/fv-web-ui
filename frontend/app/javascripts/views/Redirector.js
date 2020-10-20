import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FVLabel from './components/FVLabel/index'
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
        <FVLabel
          transKey="redirecting"
          defaultStr="Redirecting"
          transform="first"
        />
        ...
      </div>
    )
  }
}

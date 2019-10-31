import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

import Button from '@material-ui/core/Button'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export default function withToggle() {
  class ViewwithToggle extends Component {
    static defaultProps = {
      mobileOnly: false,
      label: 'Toggle Panel',
      className: '',
    }

    static propTypes = {
      mobileOnly: PropTypes.bool,
      label: PropTypes.string,
      className: PropTypes.string,
      children: PropTypes.any, // TODO: set to correct proptype
    }

    constructor(props, context) {
      super(props, context)
      this.rootClassNames.push(this.props.className)
      this.state = {
        open: false,
      }
    }

    rootClassNames = ['panel', 'panel-default']

    render() {
      const { mobileOnly, label } = this.props
      const fontStyle = { float: 'right', lineHeight: 1 }
      const icon = this.state.open ? (
        <ExpandLessIcon className="material-icons" style={fontStyle} />
      ) : (
        <ExpandMoreIcon className="material-icons" style={fontStyle} />
      )
      const labelText = this.state.open ? intl.trans('hide', 'Hide', 'first') : intl.trans('show', 'Show', 'first')
      return (
        <div className={classNames(...this.rootClassNames)}>
          <div className="panel-heading">
            {label}
            <Button
              variant="flat"
              className={classNames({ 'visible-xs': mobileOnly })}
              onClick={(e) => {
                this.setState({ open: !this.state.open })
                e.preventDefault()
              }}
              style={{ float: 'right', lineHeight: 1 }}
            >
              {icon}
              {labelText}
            </Button>
          </div>

          <div className={classNames('panel-body', { 'hidden-xs': !this.state.open && mobileOnly })}>
            {this.props.children}
          </div>
        </div>
      )
    }
  }

  return ViewwithToggle
}

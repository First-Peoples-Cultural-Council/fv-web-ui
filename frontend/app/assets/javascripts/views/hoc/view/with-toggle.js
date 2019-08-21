import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'

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

      const icon = <Icon className="material-icons">{this.state.open ? 'expand_less' : 'expand_more'}</Icon>
      const labelText = this.state.open ? intl.trans('hide', 'Hide', 'first') : intl.trans('show', 'Show', 'first')
      return (
        <div className={classNames(...this.rootClassNames)}>
          <div className="panel-heading">
            {label}
            <Button
              className={classNames({ 'visible-xs': mobileOnly })}
              icon={icon}
              labelPosition="before"
              onClick={(e) => {
                this.setState({ open: !this.state.open })
                e.preventDefault()
              }}
              style={{ float: 'right', lineHeight: 1 }}
            >
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

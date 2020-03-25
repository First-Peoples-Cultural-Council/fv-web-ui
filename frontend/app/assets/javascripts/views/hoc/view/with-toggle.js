import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import FVButton from 'views/components/FVButton'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FVLabel from '../../components/FVLabel/index'

export default function withToggle() {
  class ViewwithToggle extends Component {
    static defaultProps = {
      mobileOnly: false,
      label: <FVLabel transKey="general.toggle_panel" defaultStr="Toggle Panel" transform="first" />,
      className: '',
    }

    static propTypes = {
      mobileOnly: PropTypes.bool,
      label: PropTypes.object,
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
      const labelText = this.state.open ? (
        <FVLabel transKey="hide" defaultStr="Hide" transform="first" />
      ) : (
        <FVLabel transKey="show" defaultStr="Show" transform="first" />
      )
      return (
        <div className={classNames(...this.rootClassNames)}>
          <div className="panel-heading">
            {label}
            <FVButton
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
            </FVButton>
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

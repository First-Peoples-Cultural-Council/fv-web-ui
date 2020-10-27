import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import classNames from 'classnames'
import selectn from 'selectn'
import { SECTIONS } from 'common/Constants'
function deepAssignPropsToChildren(children, cb) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }
    let _child = child

    if (child.props.children) {
      _child = React.cloneElement(child, {
        children: deepAssignPropsToChildren(child.props.children, cb),
      })
    }

    return cb(_child)
  })
}

export default class AuthorizationFilter extends Component {
  static propTypes = {
    children: PropTypes.node,
    hideFromSections: PropTypes.bool,
    renderPartial: PropTypes.bool,
    showAuthError: PropTypes.bool,
    routeParams: PropTypes.object,
    key: PropTypes.string,
  }

  static defaultProps = {
    hideFromSections: false,
    renderPartial: false,
    showAuthError: false,
  }

  constructor(props, context) {
    super(props, context)

    // Bind methods to 'this'
    ;['_renderHelper'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  /**
   * Renders partial view or nothing at all, depending on a flag
   */
  _renderHelper() {
    if (this.props.renderPartial) {
      const children = deepAssignPropsToChildren(this.props.children, function (child) {
        return React.cloneElement(child, { accessDenied: true })
      })
      return <div>{children}</div>
    }
    return null
  }

  render() {
    const { children, filter, hideFromSections, routeParams /*, ...other*/ } = this.props

    const authErrorObj = (
      <div className={classNames('alert', 'alert-warning')} role="alert">
        You are not authorized to view this content.
      </div>
    )

    const isSection = selectn('area', routeParams) === SECTIONS

    const currentUserEntityPermissions = selectn('contextParameters.permissions', filter.entity)

    if (hideFromSections && isSection) {
      return this.props.showAuthError ? authErrorObj : null
    }

    if (filter.hasOwnProperty('permission')) {
      if (!currentUserEntityPermissions || currentUserEntityPermissions.indexOf(filter.permission) === -1) {
        return this._renderHelper()
      }
    } else if (filter.hasOwnProperty('role') && filter.hasOwnProperty('login')) {
      const acls = selectn('contextParameters.acls', filter.entity)

      if (acls) {
        const combinedAces = selectn('[0].aces', acls).concat(selectn('[1].aces', acls) || [])
        const extendedUserGroups = Immutable.fromJS(selectn('response.extendedGroups', filter.login))

        if (!extendedUserGroups || extendedUserGroups.size === 0) {
          return this._renderHelper()
        }

        // Get the ACEs that match the required permissions
        const filteredAceList = Immutable.fromJS(combinedAces).filter(function (entry) {
          return (
            filter.role.indexOf(entry.get('permission')) !== -1 &&
            entry.get('granted') &&
            entry.get('status') == 'effective'
          )
        })

        // Test ACEs against user's roles
        const userHasRole = filteredAceList.findIndex(function (entry) {
          // Test each group/username against ACE
          const hasRole = extendedUserGroups.findIndex(function (extendedGroupEntry) {
            return (
              entry.get('username') == extendedGroupEntry.get('name') ||
              entry.get('username') == selectn('response.id', filter.login)
            )
          })

          return hasRole === -1 ? false : true
        })

        if (!currentUserEntityPermissions || userHasRole === -1) {
          return this._renderHelper()
        }
      } else {
        return this.props.showAuthError ? authErrorObj : null
      }
    } else {
      return this.props.showAuthError ? authErrorObj : null
    }

    const combinedProps = { key: this.props.key, style: Object.assign({}, this.props.style, children.props.style) }

    return React.cloneElement(children, combinedProps)
  }
}

import React from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import Contributors from 'views/pages/explore/dialect/contributors'
import internationalization from './internationalization'
import NavigationHelpers from 'common/NavigationHelpers'
const { func, object, string } = PropTypes

export class Recorders extends React.Component {
  static propTypes = {
    className: string,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    className: 'FormRecorder',
    pushWindowPath: () => {},
  }

  render() {
    const { routeParams } = this.props
    const { siteTheme, dialect_path } = routeParams
    const editUrl = `/${siteTheme}${dialect_path}/edit/recorder`
    const detailUrl = `/${siteTheme}${dialect_path}/recorder`
    const btnCreate = (
      <a
        className="_btn _btn--primary Contributors__btnCreate"
        href={`/${siteTheme}${dialect_path}/create/recorder`}
        onClick={(e) => {
          e.preventDefault()
          NavigationHelpers.navigate(`/${siteTheme}${dialect_path}/create/recorder`, this.props.pushWindowPath, false)
        }}
      >
        Create a new recorder
      </a>
    )
    return (
      <Contributors
        className={this.props.className}
        copy={internationalization}
        editUrl={editUrl}
        detailUrl={detailUrl}
        btnCreate={btnCreate}
      />
    )
  }
}
// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { navigation } = state

  const { route } = navigation

  return {
    routeParams: route.routeParams,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recorders)

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
    const { theme, dialect_path } = routeParams
    const editUrl = `/${theme}${dialect_path}/edit/recorder/`
    const btnCreate = (
      <a
        className="_btn _btn--primary Contributors__btnCreate"
        href={`/${theme}${dialect_path}/create/recorder`}
        onClick={(e) => {
          e.preventDefault()
          NavigationHelpers.navigate(`/${theme}${dialect_path}/create/recorder`, this.props.pushWindowPath, false)
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

import React from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'

import ContributorCreate from 'components/Contributor/create'
import validator from './validator'
import copy from './copy'
const { object, string } = PropTypes

export class RecorderCreate extends React.Component {
  static propTypes = {
    className: string,
    // REDUX: reducers/state
    routeParams: object.isRequired,
  }
  static defaultProps = {
    className: '',
  }

  render() {
    const { routeParams } = this.props
    const { siteTheme, dialect_path } = routeParams
    const generateUrlDetail = (uid) => `/${siteTheme}${dialect_path}/recorder/${uid}`
    const generateUrlEdit = (uid) => `/${siteTheme}${dialect_path}/edit/recorder/${uid}`
    return (
      <ContributorCreate
        className={this.props.className}
        generateUrlDetail={generateUrlDetail}
        generateUrlEdit={generateUrlEdit}
        validator={validator}
        copy={copy}
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
export default connect(mapStateToProps, null)(RecorderCreate)

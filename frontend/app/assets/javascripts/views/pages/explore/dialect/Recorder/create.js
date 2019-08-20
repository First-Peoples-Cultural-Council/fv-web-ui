import React from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'

import ContributorCreate from 'views/pages/explore/dialect/Contributor/create'
import validator from './validator'
import internationalization from './internationalization'
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
    const { theme, dialect_path } = routeParams
    const generateUrlDetail = (uid) => `/${theme}${dialect_path}/recorder/${uid}`
    const generateUrlEdit = (uid) => `/${theme}${dialect_path}/edit/recorder/${uid}`
    return (
      <ContributorCreate
        className={this.props.className}
        generateUrlDetail={generateUrlDetail}
        generateUrlEdit={generateUrlEdit}
        validator={validator}
        copy={internationalization}
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
export default connect(
  mapStateToProps,
  null
)(RecorderCreate)

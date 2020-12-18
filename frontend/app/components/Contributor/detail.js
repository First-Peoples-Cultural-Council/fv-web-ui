import React from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchContributor, fetchContributors } from 'reducers/fvContributor'

import ProviderHelpers from 'common/ProviderHelpers'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'

import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import StateDetail from './states/detail'

import './Contributor.css'

const { element, func, number, object, string } = PropTypes

export class Contributor extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    groupName: string,
    breadcrumb: element,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    onDocumentCreated: func,
    validator: object,
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    routeParams: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchContributor: func.isRequired,
    fetchContributors: func.isRequired,
  }
  static defaultProps = {
    className: 'Contributor',
  }

  state = {
    componentState: STATE_LOADING,
  }
  async componentDidMount() {
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "ContributorDetailsCopy" */ './copy').then((_copy) => {
          return _copy.default
        })

    await this._getData({ copy })
  }
  render() {
    let content = null
    switch (this.state.componentState) {
      case STATE_LOADING: {
        content = this._stateGetLoading()
        break
      }

      case STATE_DEFAULT: {
        content = this._stateGetDetail()
        break
      }
      case STATE_ERROR_BOUNDARY: {
        content = this._stateGetErrorBoundary()
        break
      }
      default:
        content = <div>{/* Shouldn't get here */}</div>
    }
    return content
  }
  _getData = async (addToState = {}) => {
    // Do any loading here...
    const { routeParams } = this.props
    const { itemId } = routeParams
    await this.props.fetchContributor(itemId)
    const contributor = await this._getContributor()

    if (contributor.isError) {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
        errorMessage: contributor.message,
        ...addToState,
      })
    } else {
      this.setState({
        componentState: STATE_DEFAULT,
        valueName: contributor.name,
        valueDescription: contributor.description,
        valuePhotoName: contributor.photoName,
        valuePhotoData: contributor.photoData,
        isTrashed: contributor.isTrashed,
        contributor: contributor.data,
        ...addToState,
      })
    }
  }
  _stateGetLoading = () => {
    const { className } = this.props
    return <StateLoading className={className} copy={this.state.copy} />
  }
  _stateGetErrorBoundary = () => {
    return <StateErrorBoundary errorMessage={this.state.errorMessage} copy={this.state.copy} />
  }
  _stateGetDetail = () => {
    const { className, groupName } = this.props
    const { isBusy, valueDescription, valueName, valuePhotoName, valuePhotoData, isTrashed } = this.state
    return (
      <StateDetail
        copy={this.state.copy}
        className={className}
        groupName={groupName}
        isBusy={isBusy}
        valueName={valueName}
        isTrashed={isTrashed}
        valueDescription={valueDescription}
        valuePhotoName={valuePhotoName}
        valuePhotoData={valuePhotoData}
      />
    )
  }
  _getContributor = async () => {
    const { computeContributor, routeParams } = this.props
    const { itemId } = routeParams
    // Extract data from immutable:
    const _computeContributor = await ProviderHelpers.getEntry(computeContributor, itemId)
    if (_computeContributor.success) {
      // Extract data from object:
      const name = selectn(['response', 'properties', 'dc:title'], _computeContributor)
      const description = selectn(['response', 'properties', 'dc:description'], _computeContributor)
      const photoName = selectn(
        ['response', 'properties', 'fvcontributor:profile_picture', 'name'],
        _computeContributor
      )
      const photoData = selectn(
        ['response', 'properties', 'fvcontributor:profile_picture', 'data'],
        _computeContributor
      )

      const isTrashed = selectn(['response', 'isTrashed'], _computeContributor) || false
      // Respond...
      return { isTrashed, name, description, photoName, photoData, data: _computeContributor }
    }
    return { isError: _computeContributor.isError, message: _computeContributor.message }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, navigation } = state

  const { computeContributor } = fvContributor

  const { route } = navigation

  return {
    computeContributor,
    routeParams: route.routeParams,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchContributor,
  fetchContributors,
}

export default connect(mapStateToProps, mapDispatchToProps)(Contributor)

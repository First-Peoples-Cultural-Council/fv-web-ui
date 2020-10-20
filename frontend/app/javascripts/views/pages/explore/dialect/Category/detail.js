import React from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategory, fetchCategories } from 'providers/redux/reducers/fvCategory'

import ProviderHelpers from 'common/ProviderHelpers'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'

import StateLoading from 'views/components/Loading'
import StateErrorBoundary from 'views/components/ErrorBoundary'
import StateDetail from './states/detail'

import '!style-loader!css-loader!./styles.css'

// let _computeCategories = undefined
// const categoryType = {
//   title: { plural: 'Categories', singular: 'Category' },
//   label: { plural: 'categories', singular: 'category' },
// }
const { element, func, number, object, string } = PropTypes

export class CategoryDetail extends React.Component {
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
    computeCategory: object.isRequired,
    computeCategories: object.isRequired,
    routeParams: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchCategory: func.isRequired,
    fetchCategories: func.isRequired,
  }
  static defaultProps = {
    className: 'Category',
  }

  state = {
    componentState: STATE_LOADING,
  }
  async componentDidMount() {
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "CategoryDetailInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )

    await this._getData({ copy })
  }

  async componentDidUpdate() {
    // const { computeCategories, routeParams } = this.props
    // const categoriesPath = `${routeParams.dialect_path}/${categoryType.title.plural}/`
    // _computeCategories = ProviderHelpers.getEntry(computeCategories, categoriesPath)
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
    await this.props.fetchCategory(itemId)
    const item = await this._getItem()

    if (item.isError) {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
        errorMessage: item.message,
        ...addToState,
      })
    } else {
      this.setState({
        componentState: STATE_DEFAULT,
        valueName: item.name,
        valueDescription: item.description,
        valueParent: item.parent,
        isTrashed: item.isTrashed,
        item: item.data,
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
    const { isBusy, valueDescription, valueName, valueParent, isTrashed } = this.state
    return (
      <StateDetail
        copy={this.state.copy}
        className={className}
        groupName={groupName}
        isBusy={isBusy}
        isTrashed={isTrashed}
        valueName={valueName}
        valueDescription={valueDescription}
        valueParent={valueParent}
      />
    )
  }
  _getItem = async () => {
    const { computeCategory, routeParams } = this.props
    const { itemId } = routeParams
    // Extract data from immutable:
    const _computeCategory = await ProviderHelpers.getEntry(computeCategory, itemId)
    if (_computeCategory.success) {
      // Extract data from object:
      const name = selectn(['response', 'properties', 'dc:title'], _computeCategory)
      const description = selectn(['response', 'properties', 'dc:description'], _computeCategory)
      const parent = selectn(['response', 'contextParameters', 'parentDoc', 'title'], _computeCategory)
      const isTrashed = selectn(['response', 'isTrashed'], _computeCategory) || false
      // Respond...
      return { isTrashed, name, description, parent, data: _computeCategory }
    }
    return { isError: _computeCategory.isError, message: _computeCategory.message }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, navigation } = state
  const { computeCategory, computeCategories } = fvCategory
  const { route } = navigation
  return {
    computeCategory,
    computeCategories,
    routeParams: route.routeParams,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategory,
  fetchCategories,
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDetail)

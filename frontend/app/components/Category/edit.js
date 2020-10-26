import React from 'react'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import StateLoading from 'componentsShared/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import StateSuccessEdit from './states/successEdit'
import StateSuccessDelete from './states/successDelete'
import StateEdit from './states/create'
import AuthenticationFilter from 'componentsShared/AuthenticationFilter'
import PromiseWrapper from 'componentsShared/PromiseWrapper'

// Immutable
import Immutable from 'immutable'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createCategory, deleteCategory, fetchCategory, fetchCategories, updateCategory } from 'reducers/fvCategory'
import { fetchDialect, fetchDialect2 } from 'reducers/fvDialect'
import { pushWindowPath } from 'reducers/windowPath'

import selectn from 'selectn'
import { getFormData, handleSubmit } from 'common/FormHelpers'

// Models
import { Document } from 'nuxeo'

import {
  STATE_LOADING,
  STATE_DEFAULT,
  STATE_ERROR,
  STATE_SUCCESS,
  STATE_SUCCESS_DELETE,
  STATE_ERROR_BOUNDARY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_LANGUAGE,
  DEFAULT_SORT_COL,
  DEFAULT_SORT_TYPE,
} from 'common/Constants'

import '!style-loader!css-loader!./styles.css'

const { array, element, func, number, object, string } = PropTypes

const categoryType = {
  title: { plural: 'Categories', singular: 'Category' },
  label: { plural: 'categories', singular: 'category' },
}

export class CategoryEdit extends React.Component {
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
    createUrl: string,
    // REDUX: reducers/state
    computeCategory: object.isRequired,
    computeCategories: object.isRequired,
    computeCreateCategory: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createCategory: func.isRequired,
    deleteCategory: func.isRequired,
    fetchCategory: func.isRequired,
    fetchCategories: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    updateCategory: func.isRequired,
  }
  static defaultProps = {
    className: 'FormCategory',
    groupName: '',
    breadcrumb: null,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    DEFAULT_LANGUAGE,
    DEFAULT_SORT_COL,
    DEFAULT_SORT_TYPE,
  }

  _commonInitialState = {
    errors: [],
    formData: {},
    isBusy: false,
  }
  state = {
    componentState: STATE_LOADING,
    ...this._commonInitialState,
  }
  // NOTE: Using callback refs since on old React
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  form = null
  setFormRef = (_element) => {
    this.form = _element
  }

  async componentDidMount() {
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "CategoryCopy" */ './copy').then((_copy) => {
          return _copy.default
        })

    const validator = this.props.validator
      ? this.props.validator
      : await import(/* webpackChunkName: "CategoryValidator" */ './validator').then((_validator) => {
          return _validator.default
        })
    await this._getData({ copy, validator })
  }
  render() {
    let content = null
    switch (this.state.componentState) {
      case STATE_DEFAULT: {
        content = this._stateGetEdit()
        break
      }
      case STATE_ERROR: {
        content = this._stateGetError()
        break
      }
      case STATE_SUCCESS: {
        content = this._stateGetSuccess()
        break
      }
      case STATE_SUCCESS_DELETE: {
        content = this._stateGetSuccessDelete()
        break
      }
      case STATE_ERROR_BOUNDARY: {
        // STATE_ERROR_BOUNDARY === server or authentication issue
        content = this._stateGetErrorBoundary()
        break
      }
      default:
        // STATE_LOADING === loading
        content = this._stateGetLoading()
    }
    return content
  }
  _getData = async (addToState = {}) => {
    // Do any loading here...
    const { routeParams } = this.props
    const { itemId } = routeParams
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)
    await this.props.fetchCategory(itemId)
    await this.props.fetchCategories(`/api/v1/path/${routeParams.dialect_path}/${categoryType.title.plural}/@children`)
    const item = await this._getItem()
    const categories = await this._getCategories(item)

    if (item.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: item.message,
        ...addToState,
      })
    } else {
      this.setState({
        errorMessage: undefined,
        componentState: STATE_DEFAULT,
        valueName: item.name,
        valueParent: item.parent.title,
        valueParentId: item.parent.id,
        valueDescription: item.description,
        valueCategories: categories.dialectCategories,
        isTrashed: item.isTrashed,
        item: item.data,
        ...this._commonInitialState,
        ...addToState,
      })
    }
  }
  _stateGetLoading = () => {
    const { className } = this.props
    return <StateLoading className={className} isEdit copy={this.state.copy} />
  }
  _stateGetErrorBoundary = () => {
    // Make `errorBoundary.explanation` === `errorBoundary.explanationEdit`
    const _copy = Object.assign({}, this.state.copy)
    _copy.errorBoundary.explanation = this.state.copy.errorBoundary.explanationEdit
    return <StateErrorBoundary errorMessage={this.state.errorMessage} copy={this.state.copy} />
  }
  _stateGetEdit = () => {
    const { className, breadcrumb, groupName } = this.props
    const {
      errors,
      isBusy,
      isTrashed,
      valueDescription,
      valueName,
      valueParent,
      valueParentId,
      valueCategories,
    } = this.state
    return (
      <AuthenticationFilter
        login={this.props.computeLogin}
        anon={false}
        routeParams={this.props.routeParams}
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper
          computeEntities={Immutable.fromJS([
            {
              id: `/${this.props.routeParams.dialect_path}`,
              entity: this.props.fetchDialect,
            },
          ])}
        >
          <StateEdit
            copy={this.state.copy}
            className={className}
            groupName={groupName}
            breadcrumb={breadcrumb}
            errors={errors}
            isBusy={isBusy}
            isTrashed={isTrashed}
            isEdit
            deleteItem={() => {
              this.props.deleteCategory(this.state.item.id)
              this.setState({
                componentState: STATE_SUCCESS_DELETE,
              })
            }}
            onRequestSaveForm={() => {
              this._onRequestSaveForm()
            }}
            setFormRef={this.setFormRef}
            valueName={valueName}
            valueParent={valueParent}
            valueParentId={valueParentId}
            valueDescription={valueDescription}
            valueCategories={valueCategories}
          />
        </PromiseWrapper>
      </AuthenticationFilter>
    )
  }
  _stateGetError = () => {
    // default state handles errors, just call it...
    return this._stateGetEdit()
  }
  _stateGetSuccess = () => {
    const { className } = this.props
    const { formData, itemUid } = this.state

    return (
      <StateSuccessEdit
        className={className}
        copy={this.state.copy}
        itemUid={itemUid}
        formData={formData}
        handleClick={() => {
          this._getData()
        }}
      />
    )
  }
  _stateGetSuccessDelete = () => {
    const { createUrl, className, routeParams } = this.props
    const { formData } = this.state
    const { siteTheme, dialect_path } = routeParams
    const _createUrl = createUrl || `/${siteTheme}${dialect_path}/create/${categoryType.label.singular}`
    return (
      <StateSuccessDelete createUrl={_createUrl} className={className} copy={this.state.copy} formData={formData} />
    )
  }
  async _handleUpdateItemSubmit(formData) {
    const { item } = this.state

    const newDocument = new Document(item.response, {
      repository: item.response._repository,
      nuxeo: item.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set({
      'ecm:parentRef': formData.parentRef,
      'dc:description': formData['dc:description'],
      'dc:title': formData['dc:title'],
    })

    const parentRef = formData.parentRef

    // Save document
    const _updateCategory = await this.props.updateCategory(newDocument, parentRef)

    if (_updateCategory.success) {
      this.setState({
        errors: [],
        formData,
        itemUid: _updateCategory.pathOrId,
        componentState: STATE_SUCCESS,
      })
    } else {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
        errorMessage: _updateCategory.message,
      })
    }
  }
  _onRequestSaveForm = async () => {
    const formData = getFormData({
      formReference: this.form,
    })
    const valid = () => {
      this.setState(
        {
          isBusy: true,
        },
        () => {
          this._handleUpdateItemSubmit(formData)
        }
      )
    }
    const invalid = (response) => {
      this.setState({
        errors: response.errors,
        componentState: STATE_ERROR,
      })
    }

    handleSubmit({
      validator: this.state.validator,
      formData,
      valid,
      invalid,
    })
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
      const parent = selectn(['response', 'contextParameters', 'parentDoc'], _computeCategory)
      const isTrashed = selectn(['response', 'isTrashed'], _computeCategory)

      // Respond...
      return {
        isError: _computeCategory.isError,
        name,
        description,
        parent,
        isTrashed,
        data: _computeCategory,
      }
    }
    return { isError: _computeCategory.isError, message: _computeCategory.message }
  }

  _getCategories = async ({ parent, data }) => {
    const { computeCategories, routeParams } = this.props
    const categoriesPath = `/api/v1/path/${routeParams.dialect_path}/${categoryType.title.plural}/@children`
    // Set-up array for data extraction and allow for selecting no parent category - set Categories directory as value:
    const dialectCategories = [
      {
        uid: `${this.props.routeParams.dialect_path}/Categories`,
        title: 'None',
      },
    ]
    // Extract data from immutable:
    const _computeCategories = await ProviderHelpers.getEntry(computeCategories, categoriesPath)
    if (_computeCategories.success) {
      // Extract data from object:
      let obj = {}

      _computeCategories.response.entries.forEach((entry) => {
        obj = {
          uid: entry.uid,
          title: entry.title,
          isTrashed: entry.isTrashed,
        }
        if (data.id !== entry.uid) {
          if (entry.uid === parent.id) {
            dialectCategories.unshift(obj)
          } else {
            dialectCategories.push(obj)
          }
        }
      })
      // Respond...
      return {
        hasError: _computeCategories.response.hasError,
        message: _computeCategories.response.errorMessage,
        dialectCategories,
      }
    }
    return { hasError: _computeCategories.response.hasError, message: _computeCategories.response.errorMessage }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, navigation, nuxeo, windowPath } = state

  const { computeCategory, computeCategories, computeCreateCategory } = fvCategory
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { route } = navigation
  const { computeLogin } = nuxeo
  return {
    computeLogin,
    computeCategory,
    computeCategories,
    computeCreateCategory,
    computeDialect,
    computeDialect2,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createCategory,
  deleteCategory,
  fetchCategory,
  fetchCategories,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  updateCategory,
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEdit)

import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import ProviderHelpers from 'common/ProviderHelpers'
import StateLoading from 'views/components/Loading'
import StateErrorBoundary from 'views/components/ErrorBoundary'
import StateSuccessEdit from './states/successEdit'
import StateSuccessDelete from './states/successDelete'
import StateEdit from './states/create'
import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  createCategory,
  deleteCategory,
  fetchCategory,
  fetchCategories,
  updateCategory,
} from 'providers/redux/reducers/fvCategory'
import { fetchDialect, fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

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

import '!style-loader!css-loader!./Phrasebook.css'

const { array, element, func, number, object, string } = PropTypes

export class PhrasebookEdit extends React.Component {
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
    className: 'FormPhrasebook',
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
    is403: false,
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
      : await import(/* webpackChunkName: "PhrasebookInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )

    const validator = this.props.validator
      ? this.props.validator
      : await import(/* webpackChunkName: "PhrasebookValidator" */ './validator').then((_validator) => {
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
    const item = await this._getItem()

    if (item.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        // Note: Intentional == comparison
        is403: item.message == '403',
        errorMessage: item.message,
        ...addToState,
      })
    } else {
      this.setState({
        errorMessage: undefined,
        componentState: STATE_DEFAULT,
        valueName: item.name,
        valueDescription: item.description,
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
    const { errors, isBusy, isTrashed, valueDescription, valueName } = this.state
    return (
      <AuthenticationFilter
        is403={this.state.is403}
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
            valueDescription={valueDescription}
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
    const _createUrl = createUrl || `/${siteTheme}${dialect_path}/create/phrasebook`
    return (
      <StateSuccessDelete createUrl={_createUrl} className={className} copy={this.state.copy} formData={formData} />
    )
  }
  async _handleCreateItemSubmit(formData) {
    const { item } = this.state

    const newDocument = new Document(item.response, {
      repository: item.response._repository,
      nuxeo: item.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set({
      'dc:description': formData['dc:description'],
      'dc:title': formData['dc:title'],
    })

    // Save document
    const _updateCategory = await this.props.updateCategory(newDocument, null, null)

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
          this._handleCreateItemSubmit(formData)
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
      const isTrashed = selectn(['response', 'isTrashed'], _computeCategory)

      // Respond...
      return {
        isError: _computeCategory.isError,
        name,
        description,
        isTrashed,
        data: _computeCategory,
      }
    }
    return { isError: _computeCategory.isError, message: _computeCategory.message }
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

export default connect(mapStateToProps, mapDispatchToProps)(PhrasebookEdit)

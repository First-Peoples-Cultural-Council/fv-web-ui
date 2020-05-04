import React from 'react'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import StateLoading from 'views/components/Loading'
import StateErrorBoundary from 'views/components/ErrorBoundary'
import StateSuccessDefault from './states/successCreate'
import StateCreate from './states/create'
import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// Immutable
import Immutable from 'immutable'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createCategory, fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchDialect, fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import { getFormData, handleSubmit } from 'common/FormHelpers'

import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR, STATE_SUCCESS, STATE_ERROR_BOUNDARY } from 'common/Constants'

import '!style-loader!css-loader!./styles.css'

const { array, element, func, number, object, string } = PropTypes

const categoryType = {
  title: { plural: 'Categories', singular: 'Category' },
  label: { plural: 'categories', singular: 'category' },
}

export class Category extends React.Component {
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
    validator: object,
    // REDUX: reducers/state
    routeParams: object.isRequired,
    computeLogin: object.isRequired,
    computeCategories: object.isRequired,
    computeCreateCategory: object,
    computeCategory: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createCategory: func.isRequired,
    fetchCategories: func.isRequired,
    fetchDialect: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    className: 'FormCategory',
    groupName: '',
    breadcrumb: null,
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
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
      : await import(/* webpackChunkName: "CategoryInternationalization" */ './internationalization').then((_copy) => {
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
        content = this._stateGetCreate()
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
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)
    await this.props.fetchCategories(`/api/v1/path/${routeParams.dialect_path}/${categoryType.title.plural}/@children`)
    const categories = await this._getCategories()

    if (categories.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: categories.message,
        ...addToState,
      })
    } else {
      this.setState({
        errorMessage: undefined,
        componentState: STATE_DEFAULT,
        valueCategories: categories.dialectCategories,
        ...this._commonInitialState,
        ...addToState,
      })
    }
  }

  _stateGetLoading = () => {
    const { className } = this.props
    return <StateLoading className={className} copy={this.state.copy} />
  }
  _stateGetErrorBoundary = () => {
    // Make `errorBoundary.explanation` === `errorBoundary.explanationEdit`
    const _copy = Object.assign({}, this.state.copy)
    _copy.errorBoundary.explanation = this.state.copy.errorBoundary.explanationEdit
    return <StateErrorBoundary errorMessage={this.state.errorMessage} copy={this.state.copy} />
  }
  _stateGetCreate = () => {
    const { className, breadcrumb, groupName } = this.props
    const { errors, isBusy, valueCategories } = this.state
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
          <StateCreate
            copy={this.state.copy}
            className={className}
            groupName={groupName}
            breadcrumb={breadcrumb}
            errors={errors}
            isBusy={isBusy}
            onRequestSaveForm={() => {
              this._onRequestSaveForm()
            }}
            setFormRef={this.setFormRef}
            valueCategories={valueCategories}
          />
        </PromiseWrapper>
      </AuthenticationFilter>
    )
  }
  _stateGetError = () => {
    // _stateGetCreate() also handles errors, so just call it...
    return this._stateGetCreate()
  }
  _stateGetSuccess = () => {
    const { className } = this.props
    const { formData, itemUid } = this.state
    return (
      <StateSuccessDefault
        className={className}
        copy={this.state.copy}
        formData={formData}
        itemUid={itemUid}
        handleClick={() => {
          this.setState({
            componentState: STATE_DEFAULT,
            ...this._commonInitialState,
          })
        }}
      />
    )
  }

  _getCategories = async () => {
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
        dialectCategories.push(obj)
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

  _handleCreateItemSubmit = async (formData) => {
    // Submit here
    const now = Date.now()
    const name = formData['dc:title']
    const parentRef = formData.parentRef

    const results = await this.props.createCategory(
      parentRef, // parentDoc:
      {
        // docParams:
        type: 'FVCategory',
        name: name,
        parentRef: parentRef,
        properties: {
          'dc:description': formData['dc:description'],
          'dc:title': formData['dc:title'],
        },
      },
      null,
      now
    )

    if (results.success === false) {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
      })
      return
    }

    const response = results ? results.response : {}

    if (response && response.uid) {
      this.setState({
        errors: [],
        formData,
        itemUid: response.uid,
        componentState: STATE_SUCCESS,
        categoryPath: `${this.props.routeParams.dialect_path}/Categories/${formData['dc:title']}.${now}`,
      })
    } else {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
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
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, windowPath, navigation, nuxeo } = state
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
  fetchCategories,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)

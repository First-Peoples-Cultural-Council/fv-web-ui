import React from 'react'
import PropTypes from 'prop-types'
// import ProviderHelpers from 'common/ProviderHelpers'
import StateLoading from 'views/components/Loading'
import StateErrorBoundary from 'views/components/ErrorBoundary'
import StateSuccessDefault from './states/successCreate'
import StateCreate from './states/create'

// Immutable
import Immutable, { Map } from 'immutable' // eslint-disable-line

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { createCategory, fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchDialect } from 'providers/redux/reducers/fvDialect'

import { getFormData, handleSubmit } from 'common/FormHelpers'

import AuthenticationFilter from 'views/components/Document/AuthenticationFilter'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import {
  STATE_LOADING,
  STATE_DEFAULT,
  STATE_ERROR,
  STATE_SUCCESS,
  STATE_ERROR_BOUNDARY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_LANGUAGE,
  DEFAULT_SORT_COL,
  DEFAULT_SORT_TYPE,
} from 'common/Constants'

import '!style-loader!css-loader!./Phrasebook.css'

const { array, element, func, number, object, string } = PropTypes

let categoriesPath = undefined
export class Phrasebook extends React.Component {
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
    fetchCategories: func.isRequired,
    fetchDialect: func.isRequired,
    pushWindowPath: func.isRequired,
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
  }
  state = {
    componentState: STATE_LOADING,
    is403: false,
    ...this._commonInitialState,
  }
  // NOTE: Using callback refs since on old React
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  form = null
  setFormRef = (_element) => {
    this.form = _element
  }

  async componentDidMount() {
    const { routeParams /*, filter*/ } = this.props
    const { pageSize, page } = routeParams

    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "PhrasebookInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )

    categoriesPath = `${routeParams.dialect_path}/Phrase Books/`

    // Get data for computeDialect
    await this.props.fetchDialect('/' + this.props.routeParams.dialect_path)
    if (this.props.computeDialect.isError && this.props.computeDialect.error) {
      this.setState({
        componentState: STATE_DEFAULT,
        // Note: Intentional == comparison
        is403: this.props.computeDialect.error == '403',
        copy,
        errorMessage: this.props.computeDialect.error,
      })
      return
    }

    let currentAppliedFilter = '' // eslint-disable-line
    // TODO: ASK DANIEL ABOUT `filter` & `filter.currentAppliedFilter`
    // if (filter.has('currentAppliedFilter')) {
    //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
    // }

    await this.props.fetchCategories(
      categoriesPath,
      `${currentAppliedFilter}&currentPageIndex=${page - 1}&pageSize=${pageSize}&sortOrder=${
        this.props.DEFAULT_SORT_TYPE
      }&sortBy=${this.props.DEFAULT_SORT_COL}`
    )

    const validator = this.props.validator
      ? this.props.validator
      : await import(/* webpackChunkName: "PhrasebookValidator" */ './validator').then((_validator) => {
          return _validator.default
        })

    // Flip to ready state...
    this.setState({
      componentState: STATE_DEFAULT,
      copy,
      validator,
      errorMessage: undefined,
    })
  }
  render() {
    let content = null
    switch (this.state.componentState) {
      case STATE_LOADING: {
        content = this._stateGetLoading()
        break
      }

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
        content = this._stateGetErrorBoundary()
        break
      }
      default:
        content = <div>{/* Shouldn't get here */}</div>
    }

    return content
  }

  _stateGetLoading = () => {
    const { className } = this.props
    return <StateLoading className={className} copy={this.state.copy} />
  }
  _stateGetErrorBoundary = () => {
    return <StateErrorBoundary errorMessage={this.state.errorMessage} copy={this.state.copy} />
  }
  _stateGetCreate = () => {
    const { className, breadcrumb, groupName } = this.props
    const { errors, isBusy } = this.state
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
          <StateCreate
            className={className}
            copy={this.state.copy}
            groupName={groupName}
            breadcrumb={breadcrumb}
            errors={errors}
            isBusy={isBusy}
            onRequestSaveForm={() => {
              this._onRequestSaveForm()
            }}
            setFormRef={this.setFormRef}
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

  _handleCreateItemSubmit = async (formData) => {
    // Submit here
    const now = Date.now()
    const name = formData['dc:title']

    const results = await this.props.createCategory(
      `${this.props.routeParams.dialect_path}/Phrase Books`, // parentDoc:
      {
        // docParams:
        type: 'FVCategory',
        name: name,
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
  const { computeCategories, computeCreateCategory, computeCategory } = fvCategory
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { route } = navigation
  const { computeLogin } = nuxeo
  return {
    computeLogin,
    computeCategories,
    computeCreateCategory,
    computeCategory,
    routeParams: route.routeParams,
    computeDialect,
    computeDialect2,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createCategory,
  fetchCategories,
  fetchDialect,
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(Phrasebook)

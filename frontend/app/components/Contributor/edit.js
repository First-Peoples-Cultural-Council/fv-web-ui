import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import ProviderHelpers from 'common/ProviderHelpers'
import StateLoading from 'components/Loading'
import StateErrorBoundary from 'components/ErrorBoundary'
import StateSuccessEdit from './states/successEdit'
import StateSuccessDelete from './states/successDelete'
import StateEdit from './states/create'
import AuthenticationFilter from 'components/AuthenticationFilter'
import PromiseWrapper from 'components/PromiseWrapper'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  createContributor,
  deleteContributor,
  fetchContributor,
  fetchContributors,
  updateContributor,
} from 'reducers/fvContributor'
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

import './Contributor.css'

const { array, element, func, number, object, string } = PropTypes

export class EditContributor extends React.Component {
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
    computeContributor: object.isRequired,
    computeContributors: object.isRequired,
    computeCreateContributor: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createContributor: func.isRequired,
    deleteContributor: func.isRequired,
    fetchContributor: func.isRequired,
    fetchContributors: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    updateContributor: func.isRequired,
  }
  static defaultProps = {
    className: 'FormContributor',
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
      : await import(/* webpackChunkName: "ContributorCopy" */ './copy').then((_copy) => {
          return _copy.default
        })

    const validator = this.props.validator
      ? this.props.validator
      : await import(/* webpackChunkName: "ContributorValidator" */ './validator').then((_validator) => {
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
    const { routeParams } = this.props
    const { itemId } = routeParams

    // Get data for computeDialect
    await this.props.fetchDialect(`/${this.props.routeParams.dialect_path}`)

    await this.props.fetchContributor(itemId)
    const contributor = await this._getItem()

    if (contributor.isError) {
      this.setState({
        componentState: STATE_DEFAULT,
        errorMessage: contributor.message,
        ...addToState,
      })
    } else {
      this.setState({
        errorMessage: undefined,
        componentState: STATE_DEFAULT,
        valueName: contributor.name,
        isTrashed: contributor.isTrashed,
        valueDescription: contributor.description,
        valuePhotoName: contributor.photoName,
        valuePhotoData: contributor.photoData,
        contributor: contributor.data,
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
    return <StateErrorBoundary errorMessage={this.state.errorMessage} copy={this.state.copy} />
  }
  _stateGetEdit = () => {
    const { className, breadcrumb, groupName } = this.props
    const { errors, isBusy, isTrashed, valueDescription, valueName, valuePhotoName, valuePhotoData } = this.state
    return (
      <AuthenticationFilter.Container
        notAuthenticatedComponent={<StateErrorBoundary copy={this.state.copy} errorMessage={this.state.errorMessage} />}
      >
        <PromiseWrapper
          computeEntities={Immutable.fromJS([
            {
              id: this.props.routeParams.dialect_path,
              entity: this.props.computeDialect,
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
              this.props.deleteContributor(this.state.contributor.id)
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
            valuePhotoName={valuePhotoName}
            valuePhotoData={valuePhotoData}
          />
        </PromiseWrapper>
      </AuthenticationFilter.Container>
    )
  }
  _stateGetError = () => {
    // default state handles errors, just call it...
    return this._stateGetEdit()
  }
  _stateGetSuccess = () => {
    const { className } = this.props
    const { formData } = this.state

    return (
      <StateSuccessEdit
        className={className}
        copy={this.state.copy}
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
    const _createUrl = createUrl || `/${siteTheme}${dialect_path}/create/contributor`
    return (
      <StateSuccessDelete createUrl={_createUrl} className={className} copy={this.state.copy} formData={formData} />
    )
  }
  async _handleCreateItemSubmit(formData) {
    const { contributor } = this.state

    const newDocument = new Document(contributor.response, {
      repository: contributor.response._repository,
      nuxeo: contributor.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set({
      'dc:description': formData['dc:description'],
      'dc:title': formData['dc:title'],
    })

    // Save document
    const file =
      formData['fvcontributor:profile_picture'].length >= 1 ? formData['fvcontributor:profile_picture'][0] : null
    const _updateContributor = await this.props.updateContributor(newDocument, file, 'fvcontributor:profile_picture')

    if (_updateContributor.success) {
      this.setState({
        errors: [],
        formData,
        componentState: STATE_SUCCESS,
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
  _getItem = async () => {
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
      const isTrashed = selectn(['response', 'isTrashed'], _computeContributor)

      // Respond...
      return {
        isError: _computeContributor.isError,
        isTrashed,
        name,
        description,
        photoName,
        photoData,
        data: _computeContributor,
      }
    }
    return { isError: _computeContributor.isError, message: _computeContributor.message }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, fvDialect, navigation, windowPath } = state

  const { computeContributor, computeContributors, computeCreateContributor } = fvContributor
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { route } = navigation

  return {
    computeContributor,
    computeContributors,
    computeCreateContributor,
    computeDialect,
    computeDialect2,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createContributor,
  deleteContributor,
  fetchContributor,
  fetchContributors,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  updateContributor,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditContributor)

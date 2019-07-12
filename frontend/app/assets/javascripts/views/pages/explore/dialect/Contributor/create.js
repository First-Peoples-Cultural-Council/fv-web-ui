import React from 'react'
import { PropTypes } from 'react'
import ProviderHelpers from 'common/ProviderHelpers'
import StateLoading from './states/loading'
import StateSuccessDefault from './states/successCreate'
import StateCreate from './states/create'
import StateErrorBoundary from './states/errorBoundary'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { createContributor, fetchContributors } from 'providers/redux/reducers/fvContributor'
import { fetchDialect } from 'providers/redux/reducers/fvDialect'

import { getFormData, handleSubmit } from 'common/FormHelpers'

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

import '!style-loader!css-loader!./Contributor.css'

const { array, element, func, number, object, string } = PropTypes

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
    validator: object,
    generateUrlDetail: func,
    generateUrlEdit: func,
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    computeCreateContributor: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createContributor: func.isRequired,
    fetchContributors: func.isRequired,
    fetchDialect: func.isRequired,
    pushWindowPath: func.isRequired,
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
      : await import(/* webpackChunkName: "ContributorInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )

    // USING this.DIALECT_PATH instead of setting state
    // this.setState({ dialectPath: dialectPath })
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(this.props.splitWindowPath)
    this.CONTRIBUTOR_PATH = `${this.DIALECT_PATH}/Contributors`

    // Get data for computeDialect
    await this.props.fetchDialect('/' + this.DIALECT_PATH)
    if (this.props.computeDialect.isError && this.props.computeDialect.error) {
      // Flip to ready state...
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
        copy,
        errorMessage: this.props.computeDialect.error,
      })
      return
    }

    let currentAppliedFilter = '' // eslint-disable-line
    // if (filter.has('currentAppliedFilter')) {
    //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
    // }
    await this.props.fetchContributors(
      this.CONTRIBUTOR_PATH,
      `${currentAppliedFilter}&currentPageIndex=${this.props.DEFAULT_PAGE - 1}&pageSize=${
        this.props.DEFAULT_PAGE_SIZE
      }&sortOrder=${this.props.DEFAULT_SORT_TYPE}&sortBy=${this.props.DEFAULT_SORT_COL}`
    )

    const validator = this.props.validator
      ? this.props.validator
      : await import(/* webpackChunkName: "ContributorValidator" */ './validator').then((_validator) => {
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
    //   isFetching || isSuccess
    // const isInProgress = false
    // // const isFetching = selectn('isFetching', computeCreate)
    // const isFetching = false
    // const formStatus = isFetching ? <div className="alert alert-info">{'Uploading... Please be patient...'}</div> : null
    return (
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
    )
  }
  _stateGetError = () => {
    // _stateGetCreate() also handles errors, so just call it...
    return this._stateGetCreate()
  }
  _stateGetSuccess = () => {
    const { className, generateUrlDetail, generateUrlEdit } = this.props
    const { formData, itemUid } = this.state
    return (
      <StateSuccessDefault
        className={className}
        copy={this.state.copy}
        generateUrlDetail={generateUrlDetail}
        generateUrlEdit={generateUrlEdit}
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
    const file = formData['fvcontributor:profile_picture'] || null

    const results = await this.props.createContributor({
      parentDoc: `${this.DIALECT_PATH}/Contributors`,
      docParams: {
        type: 'FVContributor',
        name: name,
        properties: {
          'dc:description': formData['dc:description'],
          'dc:title': formData['dc:title'],
        },
      },
      file: file[0],
      timestamp: now,
      xpath: 'fvcontributor:profile_picture',
    })

    if (results.success === false) {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
      })
      return
    }

    const item = ProviderHelpers.getEntry(
      this.props.computeContributor,
      `${this.DIALECT_PATH}/Contributors/${name}.${now}`
    )
    const response = item.response || {}

    if (response && response.uid) {
      this.setState({
        errors: [],
        formData,
        itemUid: response.uid,
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
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvContributor, windowPath } = state

  const { computeContributor, computeCreateContributor } = fvContributor
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeContributor,
    computeCreateContributor,
    computeDialect,
    computeDialect2,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createContributor,
  fetchContributors,
  fetchDialect,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contributor)

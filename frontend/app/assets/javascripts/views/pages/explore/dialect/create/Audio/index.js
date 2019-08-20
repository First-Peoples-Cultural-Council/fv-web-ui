import React from 'react'
import PropTypes from 'prop-types'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
// import Select from 'views/components/Form/Common/Select`'
import File from 'views/components/Form/Common/File'
import Checkbox from 'views/components/Form/Common/Checkbox'
import FormContributors from 'views/components/Form/FormContributors'
import FormRecorders from 'views/components/Form/FormRecorders'
// import FormMoveButtons from 'views/components/Form/FormMoveButtons'
// import FormRemoveButton from 'views/components/Form/FormRemoveButton'

// import ProviderHelpers from 'common/ProviderHelpers'
// import Preview from 'views/components/Editor/Preview'

// import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
// import {} from "providers/redux/reducers/fv";

import { getError, getErrorFeedback, getFormData, handleSubmit } from 'common/FormHelpers'
import validator, { toParse } from './validation'
import copy from './internationalization'
import StringHelpers from 'common/StringHelpers'
import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR, STATE_SUCCESS } from 'common/Constants'
const { number, string } = PropTypes

export class CreateAudio extends React.Component {
  static propTypes = {
    className: string,
    id: number,
    groupName: string,
    // REDUX: reducers/state
    // REDUX: actions/dispatch/func
  }
  static defaultProps = {
    className: 'FormRelatedAudioItem',
    id: -1,
    groupName: 'Form__group',
  }
  state = {
    componentState: STATE_LOADING,
  }
  // NOTE: Using callback refs since on old React
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  form = null
  setFormRef = (_element) => {
    this.form = _element
  }

  componentDidMount() {
    // Do any loading here...

    // Flip to ready state...

    // To fake loading:
    // setTimeout(() => {
    //   this.setState({
    //     componentState: STATE_DEFAULT,
    //   })
    // }, 2000)

    this.setState({
      componentState: STATE_DEFAULT,
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
        content = this._stateGetDefault()
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
      default:
        content = <div>CreateAudio is misconfigured</div>
    }
    return content
  }

  _stateGetLoading = () => {
    const { className } = this.props
    return <div className={className}>_stateGetLoading</div>
  }

  _stateGetDefault = () => {
    const { className } = this.props
    // const { index } = this.props

    const { errors } = this.state

    //   isFetching || isSuccess
    const isInProgress = false
    // const isFetching = selectn('isFetching', computeCreate)
    const isFetching = false
    const formStatus = isFetching ? <div className="alert alert-info">{'Uploading... Please be patient...'}</div> : null
    return (
      <form
        className={className}
        ref={this.setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          this._onRequestSaveForm()
        }}
      >
        <h1>{copy.title}</h1>
        {/* Name ------------- */}
        <Text
          className={this.props.groupName}
          id={this._clean('dc:title')}
          name="dc:title"
          value=""
          error={getError({ errors, fieldName: 'dc:title' })}
          labelText={copy.name}
        />
        {/* Description --------------- */}
        <Textarea
          className={this.props.groupName}
          id={this._clean('dc:description')}
          labelText={copy.description}
          name="dc:description"
          value=""
          error={getError({ errors, fieldName: 'dc:description' })}
        />

        {/* File --------------- */}
        <File
          className={this.props.groupName}
          id="file"
          labelText={copy.upload}
          name="file"
          value=""
          error={getError({ errors, fieldName: 'file' })}
        />

        {/* Shared --------------- */}
        <Checkbox
          className={this.props.groupName}
          id={this._clean('fvm:shared')}
          labelText={copy.share}
          name="fvm:shared"
          handleChange={(data) => {
            this.setState({ createItemIsShared: data })
          }}
          error={getError({ errors, fieldName: 'fvm:shared' })}
        />
        {/* Child focused --------------- */}
        <Checkbox
          className={this.props.groupName}
          id={this._clean('fvm:child_focused')}
          labelText={copy.childFocused}
          name="fvm:child_focused"
          handleChange={(data) => {
            this.setState({ createItemIsChildFocused: data })
          }}
          error={getError({ errors, fieldName: 'fvm:child_focused' })}
        />

        {/* Contributors: fvm:source --------------- */}
        <FormContributors
          className={this.props.groupName}
          id={this._clean('fv:source')}
          name="fv:source"
          textInfo={copy.contributorsText}
          handleItemsUpdate={(data) => {
            this.setState({ createItemContributors: data })
          }}
          error={getError({ errors, fieldName: 'fv:source' })}
        />

        {/* Recorders: fvm:recorder --------------- */}
        <FormRecorders
          className={this.props.groupName}
          id={this._clean('fvm:recorder')}
          name="fvm:recorder"
          textInfo={copy.recordersText}
          handleItemsUpdate={(data) => {
            this.setState({ createItemRecorders: data })
          }}
          error={getError({ errors, fieldName: 'fvm:recorder' })}
        />

        {formStatus}
        {getErrorFeedback({ errors })}

        {/* BTN: Create contributor ------------- */}
        <button disabled={isInProgress} type="submit">
          {copy.submit}
        </button>

        {/* BTN: Cancel, go back ------------- */}
        <button
          disabled={isInProgress}
          type="button"
          onClick={() => {
            // console.log('Cancel pressed')
            // this.setState({
            //   componentState: this.STATE_DEFAULT,
            // })
          }}
        >
          {copy.cancel}
        </button>
      </form>
    )
  }
  _stateGetError = () => {
    const { className } = this.props
    return <div className={className}>_stateGetError</div>
  }
  _stateGetSuccess = () => {
    const { className } = this.props
    return <div className={className}>_stateGetSuccess</div>
  }
  _clean = (name) => {
    return StringHelpers.clean(name, 'CLEAN_ID')
  }
  _handleClickCreateItem = () => {
    // console.log('!', '_handleClickCreateItem')
    // const { handleClickCreateItem } = this.props
    // this.setState(
    //   {
    //     componentState: this.STATE_CREATE,
    //   },
    //   () => {
    //     handleClickCreateItem()
    //   }
    // )
  }
  // eslint-disable-next-line
  _handleSubmitExistingItem = (createItemUid) => {
    // console.log('!', '_handleSubmitExistingItem')
    // this.setState(
    //   {
    //     componentState: this.STATE_CREATED,
    //     contributorUid: createItemUid,
    //   },
    //   () => {}
    // )
  }

  async _handleCreateItemSubmit() {
    // console.log('!', '_handleCreateItemSubmit')
    // validationForm
    // const {
    //   createItemName,
    //   createItemDescription,
    //   createItemFile,
    //   createItemIsShared,
    //   createItemIsChildFocused,
    //   createItemContributors,
    //   createItemRecorders,
    // } = this.state
    // const docParams = {
    //   type: 'FVAudio',
    //   name: createItemName,
    //   properties: {
    //     'dc:title': createItemName,
    //     'dc:description': createItemDescription,
    //     'fvm:shared': createItemIsShared,
    //     'fvm:child_focused': createItemIsChildFocused,
    //     'fvm:recorder': createItemRecorders['fvm:recorder'],
    //     'fvm:source': createItemContributors['fvm:source'],
    //   },
    // }
    // const timestamp = Date.now()
    // const { DIALECT_PATH } = this.props
    // this.props.createAudio(`${DIALECT_PATH}/Resources`, docParams, createItemFile, timestamp)
    // const pathOrId = `${DIALECT_PATH}/Resources/${createItemName}.${timestamp}`
    // this.setState({ pathOrId })
  }
  _onRequestSaveForm = async () => {
    const formData = getFormData({
      formReference: this.form,
      toParse,
    })
    // console.log('!? formData', formData)
    const valid = () => {
      // const now = Date.now()
      // this.props.createWord(
      //   this.props.routeParams.dialect_path + '/Dictionary',
      //   {
      //     type: 'FVWord',
      //     name: now.toString(),
      //     properties: formData,
      //   },
      //   null,
      //   now
      // )
      // console.log('Would have submitted!', formData)
      this.setState({
        errors: [],
      })
    }

    const invalid = (response) => {
      // console.log('Errored with!', formData)
      this.setState({
        errors: response.errors,
      })
    }

    handleSubmit({
      validator,
      formData,
      valid,
      invalid,
    })
  }
}

// // REDUX: reducers/state
// const mapStateToProps = (state /*, ownProps*/) => {
//   const { fvDialect, navigation, nuxeo, windowPath } = state;

//   const { properties } = navigation;
//   const { computeLogin } = nuxeo;
//   const { computeDialect2 } = fvDialect;
//   const { splitWindowPath, _windowPath } = windowPath;

//   return {
//     computeDialect2,
//     computeLogin,
//     properties,
//     splitWindowPath,
//     windowPath: _windowPath
//   };
// };

// // REDUX: actions/dispatch/func
// const mapDispatchToProps = {
//   changeTheme
// };

export default connect(
  null, // mapStateToProps,
  null // mapDispatchToProps
)(CreateAudio)

import React from 'react'
import PropTypes from 'prop-types'
import Text from 'components/Form/Common/Text'
import Textarea from 'components/Form/Common/Textarea'
import File from 'components/Form/Common/File'
import Checkbox from 'components/Form/Common/Checkbox'
import FormContributors from 'components/Form/FormContributors'
import FormRecorders from 'components/Form/FormRecorders'

// REDUX
import { connect } from 'react-redux'

import { getError, getErrorFeedback, getFormData, handleSubmit } from 'common/FormHelpers'
import validator, { toParse } from './validator'
import copy from './copy'
import StringHelpers from 'common/StringHelpers'
import { STATE_LOADING, STATE_DEFAULT, STATE_ERROR, STATE_SUCCESS } from 'common/Constants'
const { number, string } = PropTypes

export class CreateAudio extends React.Component {
  static propTypes = {
    className: string,
    id: number,
    groupName: string,
  }
  static defaultProps = {
    className: 'FormRelatedAudioItem',
    id: -1,
    groupName: 'Form__group',
  }
  state = {
    componentState: STATE_LOADING,
  }

  form = React.createRef()

  componentDidMount() {
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

    const { errors } = this.state

    const isInProgress = false
    const isFetching = false
    const formStatus = isFetching ? <div className="alert alert-info">{'Uploading... Please be patient...'}</div> : null
    return (
      <form
        className={className}
        ref={this.form}
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

  _onRequestSaveForm = async () => {
    const formData = getFormData({
      formReference: this.form,
      toParse,
    })
    const valid = () => {
      this.setState({
        errors: [],
      })
    }

    const invalid = (response) => {
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

export default connect(
  null, // mapStateToProps,
  null // mapDispatchToProps
)(CreateAudio)

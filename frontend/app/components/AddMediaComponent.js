// TODO: REMOVE ESLINT-DISABLE
/* eslint-disable */

/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createAudio } from 'reducers/fvAudio'
import { createPicture } from 'reducers/fvPicture'
import { createVideo } from 'reducers/fvVideo'

import selectn from 'selectn'
import t from 'tcomb-form'
import classNames from 'classnames'

import ProviderHelpers from 'common/ProviderHelpers'

import fields from 'common/schemas/fields'
import options from 'common/schemas/options'

import FVButton from 'components/FVButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FVLabel from 'components/FVLabel'

// TODO: Cleanup class

const { func, object, string, oneOfType } = PropTypes
export class AddMediaComponent extends Component {
  static propTypes = {
    onComplete: func.isRequired,
    label: oneOfType([object, string]).isRequired,
    type: string.isRequired,
    dialect: object.isRequired,
    // REDUX: reducers/state
    computeAudio: object.isRequired,
    computePicture: object.isRequired,
    computeVideo: object.isRequired,
    // REDUX: actions/dispatch/func
    createAudio: func.isRequired,
    createPicture: func.isRequired,
    createVideo: func.isRequired,
  }

  getDefaultValues() {
    // this.props.intl.trans('views.components.editor.upload_media', 'Upload Media', 'words')
    label: this.props.intl.trans('views.components.editor.upload_media', 'Upload Media', 'words')
  }

  handleOpen() {
    this.setState({ open: true })
  }

  handleClose() {
    this.setState({ open: false })
  }

  _handleSelectElement(value) {
    this.props.onComplete(value)
  }

  constructor(props) {
    super(props)

    this.formMedia = React.createRef()

    this._change = this._change.bind(this)
    this._save = this._save.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this._handleSelectElement = this._handleSelectElement.bind(this)

    this.state = {
      typeError: '',
      uploading: false,
      open: false,
      pathOrId: null,
    }
  }

  _change(value) {
    this.setState({ value })
  }

  _save(e) {
    e.preventDefault()

    this.setState({ uploading: true })

    // tcomb-form > getValue():
    // Returns null if the validation failed; otherwise returns an instance of your model.
    const formValue = this.formMedia.current.getValue()

    // If validation passed
    if (formValue) {
      let file
      const fd = new FormData()

      for (const k in formValue) {
        const v = formValue[k]
        if (t.form.File.is(v)) {
          fd.append(k, v, v.name)
          file = v
        } else {
          fd.append(k, v)
        }
      }

      if (file) {
        const properties = {}

        for (const key in formValue) {
          if (formValue.hasOwnProperty(key) && key && key != 'file') {
            if (formValue[key] && formValue[key] != '') {
              properties[key] = formValue[key]
            }
          }
        }

        const timestamp = Date.now()
        const ResourcesPath = this.props.dialect.path + '/Resources'

        const docParams = {
          type: this.props.type,
          name: formValue['dc:title'],
          properties: Object.assign(
            properties,
            selectn('otherContext.parentId', this.props.dialect)
              ? { 'fvm:origin': selectn('otherContext.parentId', this.props.dialect) }
              : {}
          ),
        }

        switch (this.props.type) {
          case 'FVAudio':
            if (file.type.indexOf('audio') === 0) {
              this.props.createAudio(ResourcesPath, docParams, file, timestamp)
              this.setState({ typeError: '' })
            } else {
              this.setState({
                typeError: (
                  <div className={classNames('alert', 'alert-warning')} role="alert">
                    {intl.searchAndReplace(
                      'You tried to upload a file of type ' + file.type + ' when an audio file was expected'
                    )}
                  </div>
                ),
              })
            }
            break

          case 'FVPicture':
            if (file.type.indexOf('image') === 0) {
              this.props.createPicture(ResourcesPath, docParams, file, timestamp)
              this.setState({ typeError: '' })
            } else {
              this.setState({
                typeError: (
                  <div className={classNames('alert', 'alert-warning')} role="alert">
                    {intl.searchAndReplace(
                      'You tried to upload a file of type ' + file.type + ' when an image file was expected'
                    )}
                  </div>
                ),
              })
            }
            break

          case 'FVVideo':
            if (file.type.indexOf('video') === 0) {
              this.props.createVideo(ResourcesPath, docParams, file, timestamp)
              this.setState({ typeError: '' })
            } else {
              this.setState({
                typeError: (
                  <div className={classNames('alert', 'alert-warning')} role="alert">
                    {intl.searchAndReplace(
                      'You tried to upload a file of type ' + file.type + ' when an video file was expected'
                    )}
                  </div>
                ),
              })
            }
            break
          default: // NOTE: do nothing
        }

        this.setState({
          pathOrId: this.props.dialect.path + '/Resources/' + formValue['dc:title'] + '.' + timestamp,
        })
      }
    }
  }

  render() {
    let computeCreate
    let uploadText = ''
    let form = ''
    let fileTypeLabel = this.props.intl.trans('file', 'File', 'first')

    const actions = [
      <FVButton key="fb0" color="secondary" onClick={this.handleClose}>
        {this.props.intl.trans('cancel', 'Cancel', 'first')}
      </FVButton>,
    ]

    switch (this.props.type) {
      case 'FVAudio':
        computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId)
        fileTypeLabel = this.props.intl.trans('audio', 'Audio', 'first')
        break

      case 'FVPicture':
        computeCreate = ProviderHelpers.getEntry(this.props.computePicture, this.state.pathOrId)
        fileTypeLabel = this.props.intl.trans('picture', 'Picture', 'first')
        break

      case 'FVVideo':
        computeCreate = ProviderHelpers.getEntry(this.props.computeVideo, this.state.pathOrId)
        fileTypeLabel = this.props.intl.trans('video', 'Video', 'first')
        break

      default: // NOTE: do nothing
    }

    if (computeCreate && computeCreate.isFetching) {
      uploadText = (
        <div className={classNames('alert', 'alert-info')} role="alert">
          {this.props.intl.trans(
            'views.components.editor.uploading_message',
            'Uploading... Please be patient...',
            'first'
          )}
        </div>
      )
    }

    //if (this.state.schema != undefined){
    form = (
      <form onSubmit={this._save} data-testid="AddMediaComponent" id="AddMediaComponent" encType="multipart/form-data">
        <t.form.Form
          ref={this.formMedia}
          options={selectn('FVResource', options)}
          type={t.struct(selectn(this.props.type, fields))}
          value={this.state.value}
          context={this.props.dialect}
          onChange={this._change}
        />
        {uploadText}
        <FVButton
          data-testid="Dialog__AddMediaComponentUpload"
          variant="contained"
          color="primary"
          style={{ margin: '10px', float: 'right' }}
          onClick={this._save}
        >
          {this.props.intl.trans('views.components.editor.upload_media', 'Upload Media', 'words')}
        </FVButton>
        <FVButton
          data-testid="Dialog__AddMediaComponentCancel"
          variant="contained"
          color="secondary"
          style={{ margin: '10px', float: 'right' }}
          onClick={this.handleClose}
        >
          {this.props.intl.trans('cancel', 'Cancel', 'first')}
        </FVButton>
      </form>
    )
    //}

    if (computeCreate && computeCreate.success) {
      form = (
        <div>
          <div className={classNames('alert', 'alert-success')} role="success">
            Upload successful!
          </div>

          <FVButton
            data-testid="Dialog__AddMediaComponentInsert"
            variant="contained"
            color="primary"
            style={{ margin: '10px', float: 'right' }}
            onClick={(e) => {
              e.preventDefault()
              this._handleSelectElement(computeCreate.response)
            }}
          >
            {this.props.intl.trans('insert_into_entry', 'Insert into Entry', 'first')}
          </FVButton>
        </div>
      )
    }

    return (
      <div style={{ display: 'inline' }}>
        <FVButton variant="outlined" onClick={this.handleOpen}>
          {this.props.label}
        </FVButton>
        <Dialog fullWidth maxWidth="md" actions={actions} open={this.state.open}>
          <DialogTitle>
            <FVLabel
              transKey="views.components.editor.create_new_x_in_the_x_dialect"
              defaultStr={
                'Create New ' +
                fileTypeLabel +
                ' in the ' +
                selectn('properties.dc:title', this.props.dialect) +
                ' dialect.'
              }
              transform="first"
              params={[fileTypeLabel, selectn('properties.dc:title', this.props.dialect)]}
            />
          </DialogTitle>
          <DialogContent>
            <div className="form-horizontal">
              {this.state.typeError}
              {form}
            </div>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvAudio, fvPicture, fvVideo, locale } = state

  const { computeAudio } = fvAudio
  const { computePicture } = fvPicture
  const { computeVideo } = fvVideo
  const { intlService } = locale

  return {
    computeAudio,
    computePicture,
    computeVideo,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createAudio,
  createPicture,
  createVideo,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMediaComponent)

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
import selectn from 'selectn'
// REDUX
import { connect } from 'react-redux'
import Immutable from 'immutable'
import CircularProgress from '@material-ui/core/CircularProgress'

import { createLabel, fetchLabel, updateLabel, publishLabel, unpublishLabel } from 'reducers/fvLabel'
import { fetchDialect, fetchDialect2 } from 'reducers/fvDialect'
import { addNewLabelToIntl } from 'reducers/locale'
import PromiseWrapper from 'components/PromiseWrapper'
import FVLabel from 'components/FVLabel'
import { Document } from 'nuxeo'
import ProviderHelpers from 'common/ProviderHelpers'

import { withMobileDialog, Dialog } from '@material-ui/core'

import ModalContent from './modalContent'

/**
 * List view for words in immersion
 */
const { bool, func, object, string } = PropTypes

class LabelModal extends Component {
  static propTypes = {
    fullscreen: bool.isRequired,
    open: bool,
    handleClose: func,
    label: object,
    dialectPath: string,
    isNew: bool.isRequired,
    // REDUX: actions/dispatch/func
    computeDialect2: object.isRequired,
    computeLabel: object.isRequired,
    createLabel: func.isRequired,
    fetchLabel: func.isRequired,
    updateLabel: func.isRequired,
    publishLabel: func.isRequired,
    unpublishLabel: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    addNewLabelToIntl: func.isRequired,
  }

  static defaultProps = {
    fullscreen: false,
    isNew: false,
  }

  constructor(props, context) {
    super(props, context)

    this.audioRef = React.createRef()
    this.dictionaryPath = this.props.dialectPath + '/Label Dictionary'
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {}

  // This is a pretty aggresive rerendering approach meant to fix an issue with adding audio causing a rerender
  // We should refactor the various modals and forms to avoid needing to do this
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state !== nextState ||
      this.props.fullScreen !== nextProps.fullScreen ||
      this.props.open !== nextProps.open ||
      this.props.label !== nextProps.label ||
      this.props.computeLabel !== nextProps.computeLabel ||
      this.props.computeDialect2 !== nextProps.computeDialect2
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.label && this.props.label && !this.props.isNew) {
      this.props.fetchLabel(this.props.label.uid)
      this.props.fetchDialect(`/${this.props.dialectPath}`)
      this.props.fetchDialect2(this.props.dialectPath)
    }
  }

  handleCreateSave = (translation, isPublishing = false) => {
    const { label, createLabel: _createLabel, handleClose, addNewLabelToIntl: updateIntl } = this.props
    this.setState({ loading: true })

    const now = Date.now()

    const relatedAudioValue = this.audioRef.current.getValue()
    const relatedAudio = relatedAudioValue ? relatedAudioValue['fv:related_audio'] : null

    _createLabel(
      this.dictionaryPath,
      {
        type: 'FVLabel',
        name: now.toString(),
        properties: {
          'dc:title': translation.join(''),
          'fvlabel:labelKey': label.labelKey,
          'fv:related_audio': relatedAudio,
        },
      },
      null,
      now
    ).then((output) => {
      if (isPublishing) {
        this.handlePublish(output, 'Publish')
      } else {
        updateIntl(
          selectn('response.properties.dc:title', output),
          selectn('response.properties.fvlabel:labelKey', output),
          selectn('response.uid', output)
        )
        setTimeout(handleClose(true), 500)
      }
    })
  }

  handleEditSave = (translation, isPublishing = false) => {
    const { label, updateLabel: _updateLabel, computeLabel, handleClose, addNewLabelToIntl: updateIntl } = this.props
    this.setState({ loading: true })
    const computeEntities = Immutable.fromJS([
      {
        id: label.uid,
        entity: computeLabel,
      },
    ])

    const item = computeEntities.find((value) => value.get('id') === label.uid)

    const word = ProviderHelpers.getEntry(item.get('entity'), label.uid)

    const newDocument = new Document(word.response, {
      repository: word.response._repository,
      nuxeo: word.response._nuxeo,
    })

    const relatedAudioValue = this.audioRef.current.getValue()
    const relatedAudio = relatedAudioValue ? relatedAudioValue['fv:related_audio'] : null

    newDocument.set({ 'dc:title': translation.join(''), 'fv:related_audio': relatedAudio })

    _updateLabel(newDocument, null, null).then((output) => {
      if (isPublishing) {
        this.handlePublish(output, 'Republish')
      } else {
        this.setState({ loading: false })
        updateIntl(
          selectn('response.properties.dc:title', output),
          selectn('response.properties.fvlabel:labelKey', output),
          selectn('response.uid', output)
        )
        setTimeout(handleClose(true), 500)
      }
    })
  }

  handlePublish = (output, value) => {
    const { addNewLabelToIntl: updateIntl, handleClose, publishLabel: _publishLabel, label, intl } = this.props

    _publishLabel(
      label.uid,
      { value: value },
      null,
      intl.trans('views.hoc.view.x_published_successfully', 'Label Published Successfully!', 'first', ['Label'])
    ).then(() => {
      this.setState({ loading: false })
      updateIntl(
        selectn('response.properties.dc:title', output),
        selectn('response.properties.fvlabel:labelKey', output),
        selectn('response.uid', output)
      )
      setTimeout(handleClose(true), 500)
    })
  }

  handleUnpublish = () => {
    const { handleClose, unpublishLabel: _unpublishLabel, label, intl } = this.props

    _unpublishLabel(
      label.uid,
      null,
      null,
      intl.trans('views.hoc.view.x_unpublished_successfully', 'Label Unpublished Successfully!', 'first', ['Label'])
    ).then(() => {
      this.setState({ loading: false })
      setTimeout(handleClose(true), 500)
    })
  }

  renderContent = () => {
    const { isNew, label, handleClose, dialectPath } = this.props
    return label ? (
      <ModalContent
        handleClose={() => handleClose()}
        handleSave={(translation, isPublishing) =>
          isNew ? this.handleCreateSave(translation, isPublishing) : this.handleEditSave(translation, isPublishing)
        }
        handleUnpublish={() => this.handleUnpublish()}
        label={label}
        type={isNew ? 'base' : 'translation'}
        audioRef={this.audioRef}
        dialectPath={dialectPath}
      />
    ) : (
      <div />
    )
  }

  render() {
    const { fullScreen, open, handleClose, label, computeLabel, isNew, dialectPath, computeDialect2 } = this.props
    const { loading } = this.state
    const computeEntities = label
      ? Immutable.fromJS([
        {
          id: label.uid,
          entity: computeLabel,
        },
        {
          id: dialectPath,
          entity: computeDialect2,
        },
      ])
      : null
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={() => handleClose()}
          aria-labelledby="responsive-dialog-title"
          scroll="paper"
        >
          {label && !loading ? (
            <>
              {isNew ? (
                this.renderContent()
              ) : (
                <PromiseWrapper computeEntities={computeEntities}>{this.renderContent()}</PromiseWrapper>
              )}
            </>
          ) : (
            <div className="PromiseWrapper__spinnerContainer">
              <CircularProgress variant="indeterminate" className="PromiseWrapper__spinner" />
              <div className="PromiseWrapper__spinnerMessage">
                <FVLabel transKey="loading" defaultStr="Loading..." transform="first" />
              </div>
            </div>
          )}
        </Dialog>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvLabel, fvDialect, locale } = state

  const { computeDialect2 } = fvDialect
  const { computeLabel } = fvLabel
  const { intlService } = locale
  return {
    computeLabel,
    computeDialect2,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createLabel,
  fetchLabel,
  updateLabel,
  fetchDialect,
  fetchDialect2,
  publishLabel,
  unpublishLabel,
  addNewLabelToIntl,
}

export default withMobileDialog()(connect(mapStateToProps, mapDispatchToProps)(LabelModal))

import React, { Component, PropTypes } from 'react'
const { any, bool, func, string } = PropTypes
// import classNames from 'classnames'
import provide from 'react-redux-provide'
import selectn from 'selectn'
@provide
export default class ExportDialect extends Component {
  static propTypes = {
    ExportDialectReducer: any.isRequired,
    ExportDialectCheckPrevious: func.isRequired,
    ExportDialectRequest: func.isRequired,
    ExportDialectProgress: func.isRequired,
    displayDebug: bool,
    dialectId: string,
    fileName: string,
    fileUrl: string,
    isReady: bool,
    isProcessing: bool,
    isErrored: bool,
  }
  static defaultProps = {
    displayDebug: false,
    dialectId: undefined,
    fileName: '',
    fileUrl: '',
    isReady: false,
    isProcessing: false,
    isErrored: false,
  }

  polling = false
  pollingInterval = 1000
  pollingLimit = 2000000

  constructor(props) {
    super(props)
    this.state = {
      _EXPORT_DIALECT_SCHEME_HOST_URL: null,
      _dialectId: null,
    }

    // Bind methods to 'this'
    ;[
      '_checkProgress',
      '_exportDialectCheckPrevious',
      '_exportDialectRequest',
      '_exportDialectProgress',
      '_getProgress',
      '_pollServer',
      '_stateIsNotStarted',
      '_stateIsSuccess',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }
  componentDidMount() {
    this._exportDialectCheckPrevious()
  }
  componentDidUpdate(prevProps) {
    if (this.props.dialectId && prevProps.dialectId === undefined) {
      this._exportDialectCheckPrevious()
    }
  }
  componentWillUnmount() {
    this.polling = false
  }
  render() {
    if (this.props.dialectId === undefined) {
      return null
    }
    const { CONSTANTS } = this.props.ExportDialectReducer
    const { IN_PROGRESS, SUCCESS, ERROR } = CONSTANTS
    const { dialectIdLifecycle } = this._getData()

    let componentState = null
    // check current state
    switch (dialectIdLifecycle) {
      case IN_PROGRESS:
        componentState = this._stateIsInProgress()
        break
      case SUCCESS:
        componentState = this._stateIsSuccess()
        break
      case ERROR:
        componentState = this._stateIsError()
        break
      default:
        componentState = this._stateIsNotStarted()
    }

    return (
      <div>
        <h2>Export</h2>
        {componentState}
      </div>
    )
  }
  async _checkProgress() {
    // Make request
    await this._exportDialectProgress()
    // Pull data from store
    const { CONSTANTS } = this.props.ExportDialectReducer
    const { SUCCESS, ERROR } = CONSTANTS
    const { dialectIdLifecycle } = this._getData()

    // Responses
    if (dialectIdLifecycle === SUCCESS) {
      // true: Stop polling
      return true
    }

    if (dialectIdLifecycle === ERROR) {
      // false: Stop polling
      return false
    }

    // null: Continue polling
    return null
  }

  async _exportDialectCheckPrevious() {
    const { dialectId } = this.props
    if (dialectId) {
      await this.props.ExportDialectCheckPrevious(dialectId)
    }
  }
  async _exportDialectProgress() {
    const { dialectId } = this.props
    let _documentUuid = this.props.ExportDialectReducer.dialectIdDocumentUuid[dialectId]
    if (!_documentUuid) {
      const { dialectExportedDocumentUuid } = this._getData()
      _documentUuid = dialectExportedDocumentUuid
    }
    await this.props.ExportDialectProgress(dialectId, _documentUuid)
  }

  async _exportDialectRequest() {
    const { dialectId } = this.props
    await this.props.ExportDialectRequest(dialectId)
  }

  _getData() {
    const { dialectId } = this.props

    if (!dialectId) {
      return {
        dialectIdDocumentUuid,
        dialectIdLifecycle,
        dialectIdData,
      }
    }
    const {
      dialectsExported,
      dialectIdDocumentUuid,
      dialectIdLifecycle,
      dialectIdData,
    } = this.props.ExportDialectReducer

    const _dialectExported = (dialectsExported || []).filter((existingExport) => {
      const exportedDialectId = selectn('properties.fvexport:dialect', existingExport)
      return exportedDialectId === dialectId
    })
    const _dialectIdDocumentUuid = dialectIdDocumentUuid[dialectId]
    const _dialectIdLifecycle = dialectIdLifecycle[dialectId]
    const _dialectIdData = dialectIdData[dialectId]

    return {
      dialectExportedDocumentUuid: _dialectExported.length > 0 ? _dialectExported[0].uid : undefined,
      dialectIdDocumentUuid: _dialectIdDocumentUuid,
      dialectIdLifecycle: _dialectIdLifecycle,
      dialectIdData: _dialectIdData,
    }
  }
  _getProgress() {
    if (this.polling === false) {
      this.polling = true
      this._pollServer(this._checkProgress).finally(() => {
        this.polling = false
      })
    }
  }
  // Thanks: https://davidwalsh.name/javascript-polling
  _pollServer(fn) {
    // The polling function
    const timeout = this.pollingLimit
    const interval = this.pollingInterval
    const endTime = Number(new Date()) + timeout
    // eslint-disable-next-line func-names
    const checkCondition = async function(resolve, reject) {
      // If the condition is met, we're done!
      const result = await fn()
      if (result === true) {
        resolve(result)
      }
      if (result === false) {
        reject(new Error('Network request error'))
      }
      if (Number(new Date()) < endTime && result === null) {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        setTimeout(checkCondition, interval, resolve, reject)
      } else {
        // Didn't match and too much time, reject!
        reject(new Error('Timed out'))
      }
    }

    return new Promise(checkCondition)
  }

  _stateIsError() {
    // const { dialectIdData } = this._getData()
    // const { message, percentage } = dialectIdData
    return (
      <div>
        <p>There was a problem creating the export file.</p>
        <p>We have been notified of the matter and will look into it shortly.</p>
        {/* <p>{`${message || ''} ${percentage || ''}`}</p> */}
      </div>
    )
  }

  _stateIsInProgress() {
    const { dialectIdData } = this._getData()
    const { percentage } = dialectIdData

    this._getProgress()

    return (
      <div>
        <div style={{ backgroundColor: 'green', width: `${percentage}%`, height: '2px' }} />
        <p>The file is being created.</p>
      </div>
    )
  }

  _stateIsNotStarted() {
    return (
      <div>
        <p>Generate a file of this dialect for printing or use offline.</p>
        <button type="button" onClick={this._exportDialectRequest}>
          Generate export file
        </button>
      </div>
    )
  }

  _stateIsSuccess() {
    const { dialectIdData } = this._getData()
    const { ExportDialectFileUrl, ExportDialectFileName } = dialectIdData
    const content = (
      <div>
        <p>
          The file is available for download:
          <a href={ExportDialectFileUrl} style={{display: 'block', wordBreak: 'break-word'}}>{ExportDialectFileName}</a>
        </p>
      </div>
    )
    return content
  }
}

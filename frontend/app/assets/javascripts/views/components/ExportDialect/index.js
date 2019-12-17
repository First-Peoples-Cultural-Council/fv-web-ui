import React, { Component } from 'react'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  exportDialectProgress,
  exportDialectGetFormattedDocument,
  exportDialectFVGenerateDocumentWithFormat,
  exportDialectGenericError,
} from 'providers/redux/reducers/exportDialect'
import { fetchDocument } from 'providers/redux/reducers/document'

import Typography from '@material-ui/core/Typography'

import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import FVButton from 'views/components/FVButton'

import '!style-loader!css-loader!./ExportDialect.css'

const { any, string, func, object } = PropTypes
export class ExportDialect extends Component {
  static propTypes = {
    exportElement: string,
    exportLabel: string,
    query: string,
    columns: string,
    // REDUX: reducers/state
    computeDocument: object.isRequired,
    exportDialect: any.isRequired,
    routeParams: object.isRequired,
    // REDUX: actions/dispatch/func
    exportDialectFVGenerateDocumentWithFormat: func.isRequired,
    exportDialectGetFormattedDocument: func.isRequired,
    exportDialectProgress: func.isRequired,
    exportDialectGenericError: func.isRequired,
    fetchDocument: func.isRequired,
  }
  static defaultProps = {
    exportElement: 'FVWord',
    columns: '*',
    query: '*',
  }

  isPolling = false
  pollingInterval = 500
  pollingLimit = 1000 * 60 * 5 // 5 minutes: Miliseconds * Minute * Minutes

  constructor(props) {
    super(props)
    this.state = {
      dialectId: undefined,
      isBrowsing: false,
    }
  }

  async componentDidMount() {
    const { routeParams } = this.props
    await this.props.fetchDocument(routeParams.dialect_path + '/Dictionary')
    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      `${routeParams.dialect_path}/Dictionary`
    )
    const dialectId = selectn(['response', 'properties', 'fva:dialect'], computeDocument)
    if (dialectId) {
      this.setState(
        {
          dialectId,
        },
        () => {
          this.exportDialectCheckPrevious()
        }
      )
    }
  }

  render() {
    const { exportDialect } = this.props
    const { CONSTANTS } = exportDialect
    const { EXPORT_IN_PROGRESS, EXPORT_SUCCESS, EXPORT_ERROR } = CONSTANTS
    const { exportLast = {} } = this.getData()

    const ComponentOuter = (props) => (
      <div className="ExportDialect">
        <Typography variant="title" component="h2">
          Export
        </Typography>
        {props.children}
      </div>
    )

    // Suppresses issue where previous dialect's export state is shown when navigating to a new dialect
    // NOTE: fails if no export to begin with
    // if (exportLast.lifecycle === undefined || exportLast.dialectId !== this.state.dialectId) {
    //   console.log('!', {
    //     exportLast,
    //     exportLastLifecycle: exportLast.lifecycle,
    //     exportLastDialectId: exportLast.dialectId,
    //     stateDialectId: this.state.dialectId,
    //   })
    //   return null
    // }

    if (this.state.isBrowsing) {
      return <ComponentOuter>{this.stateIsBrowsing()}</ComponentOuter>
    }

    let component = null
    switch (exportLast.lifecycle) {
      case EXPORT_IN_PROGRESS:
        component = <ComponentOuter>{this.stateIsInProgress()}</ComponentOuter>
        break
      case EXPORT_SUCCESS:
        component = <ComponentOuter>{this.stateIsSuccess()}</ComponentOuter>
        break
      case EXPORT_ERROR:
        component = <ComponentOuter>{this.stateIsError()}</ComponentOuter>
        break
      default:
        component = <ComponentOuter>{this.stateIsDefault()}</ComponentOuter>
    }
    return component
  }

  exportDialectCheckPrevious = async () => {
    const { dialectId } = this.state
    if (dialectId) {
      await this.props.exportDialectGetFormattedDocument(dialectId, { format: 'CSV' })
    }
  }
  exportDialectProgress = async () => {
    const { exportLast = {} } = this.getData()
    if (exportLast.exportId) {
      await this.props.exportDialectProgress(exportLast.exportId)
    }
  }

  exportDialectRequest = async () => {
    const { dialectId } = this.state
    const { columns, exportElement, query } = this.props
    await this.props.exportDialectFVGenerateDocumentWithFormat(dialectId, {
      columns,
      exportElement,
      format: 'CSV',
      query,
    })
  }

  getButtons = () => {
    const { exportLabel, exportDialect } = this.props
    const { CONSTANTS } = exportDialect
    const { EXPORT_IN_PROGRESS } = CONSTANTS

    const { exportLast } = this.getData()

    const isExporting = exportLast.lifecycle === EXPORT_IN_PROGRESS ? true : false

    const exportButton = isExporting ? (
      <FVButton
        className="ExportDialect__button"
        disabled={isExporting}
        color="primary"
        variant="outlined"
        onClick={this.exportDialectRequest}
      >
        Exporting...
      </FVButton>
    ) : (
      <FVButton
        className="ExportDialect__button"
        color="primary"
        variant="outlined"
        onClick={this.exportDialectRequest}
      >
        Export{`${exportLabel ? ` ${exportLabel}` : ''}`}
      </FVButton>
    )
    const browseButton = (
      <FVButton
        className="ExportDialect__button"
        color="secondary"
        variant="outlined"
        onClick={async () => {
          await this.exportDialectCheckPrevious()
          this.setState({
            isBrowsing: true,
          })
        }}
      >
        {'Browse previous exports >'}
      </FVButton>
    )
    return (
      <div className="ExportDialect__buttonGroup">
        {exportButton}
        {browseButton}
      </div>
    )
  }

  getData = () => {
    const { exportDialect } = this.props
    const {
      exportData,
      exportError = [],
      exportInProgress = [],
      exportInitializing = [],
      exportSuccess = [],
      exportLast = {},
    } = exportDialect

    return {
      exportData,
      exportError,
      exportInProgress,
      exportInitializing,
      exportSuccess,
      exportLast,
      // TEMP
      timestamp: undefined,
    }
  }

  getExportedFiles = () => {
    const { exportSuccess } = this.getData()

    return exportSuccess.map((file, index) => {
      const url = selectn(['file:content', 'data'], file)
      const fileName = selectn(['file:content', 'name'], file)

      return url === undefined ? null : (
        <FVButton
          className="ExportDialect__button"
          href={url}
          color="primary"
          variant="outlined"
          component="a"
          key={index}
        >
          <span style={{ wordBreak: 'break-word' }}>{fileName}</span>
        </FVButton>
      )
    })
  }
  // Thanks: https://davidwalsh.name/javascript-polling
  pollServer = (_pollServerRegulator) => {
    // The polling function
    const timeout = this.pollingLimit
    const interval = this.pollingInterval
    const endTime = Number(new Date()) + timeout
    const checkCondition = async (resolve, reject) => {
      const result = await _pollServerRegulator()

      if (Number(new Date()) < endTime && result === 0) {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        setTimeout(checkCondition, interval, resolve, reject)
      } else {
        switch (result) {
          case 1: {
            resolve(result)
            break
          }
          case 2: {
            reject(new Error('Error encountered'))
            break
          }
          case 3: {
            reject(new Error('Could not get export progress'))
            break
          }
          default: {
            reject(new Error('Took too long to generate export'))
          }
        }
      }
    }

    return new Promise(checkCondition)
  }
  pollServerRegulator = async () => {
    // Make request
    await this.exportDialectProgress()

    // Pull data from store
    const { CONSTANTS } = this.props.exportDialect
    const { EXPORT_SUCCESS, EXPORT_ERROR } = CONSTANTS

    const { exportLast } = this.getData()

    const lifecycle = exportLast.lifecycle
    // Determine response...
    if (lifecycle === EXPORT_SUCCESS) {
      // Stops polling
      return 1
    }

    if (lifecycle === EXPORT_ERROR) {
      // Stops polling
      return 2
    }

    if (this.isPolling === false) {
      // Stops polling
      return 3
    }

    // Continues polling
    return 0
  }

  stateIsBrowsing = () => {
    return (
      <>
        <div className="ExportDialect__group">
          <Typography variant="subheading" component="h3">
            Browsing previous exports
          </Typography>
        </div>

        <div className="ExportDialect__group">{this.getExportedFiles()}</div>

        <div className="ExportDialect__buttonGroup">
          <FVButton
            className="ExportDialect__button"
            color="secondary"
            variant="outlined"
            onClick={() => {
              this.setState({
                isBrowsing: false,
              })
            }}
          >
            {'< Back'}
          </FVButton>
        </div>
      </>
    )
  }
  stateIsError = () => {
    const { exportLast } = this.getData()

    const { message } = exportLast
    return (
      <>
        <div className="ExportDialect__group">
          <Typography variant="subheading" component="h2" gutterBottom>
            The export failed.
          </Typography>

          <Typography variant="subheading" component="h3" gutterBottom>
            Details
          </Typography>
          <Typography variant="body1">{message}</Typography>
        </div>

        {this.getButtons()}
      </>
    )
  }
  stateIsInProgress = () => {
    const { exportLast, timestamp } = this.getData()

    const { percentage = 0 } = exportLast

    if (this.isPolling === false) {
      this.isPolling = true

      this.pollServer(this.pollServerRegulator).then(
        () => {
          // good
          this.isPolling = false
        },
        (error) => {
          // bad
          this.isPolling = false
          this.props.exportDialectGenericError(exportLast, error.message)
        }
      )
    }

    const progressValue = selectn(['fvexport:progressValue'], exportLast)
    const progressString = selectn(['fvexport:progressString'], exportLast)

    return (
      <>
        <div style={{ backgroundColor: 'green', width: `${percentage}%`, height: '2px' }} />
        <div className="ExportDialect__group">
          <Typography variant="subheading">Export in progress...</Typography>
        </div>

        {this.getButtons()}

        <div className="ExportDialect__group">
          <Typography variant="subheading" component="h3" gutterBottom>
            DEBUG
          </Typography>
          <Typography variant="caption">Status: {progressString}</Typography>
          <Typography variant="caption">Progress: {progressValue}</Typography>
          <Typography variant="caption">Timestamp: {timestamp}</Typography>
        </div>
      </>
    )
  }

  stateIsDefault = () => {
    return (
      <>
        <div className="ExportDialect__group">
          <Typography variant="subheading">Create a file of this page for printing or use offline.</Typography>
        </div>

        {this.getButtons()}
      </>
    )
  }

  stateIsSuccess = () => {
    const exportedFiles = this.getExportedFiles()
    return (
      <>
        <div className="ExportDialect__group">
          <Typography variant="subheading" gutterBottom>
            Last exported file for this dialect
          </Typography>

          {exportedFiles[exportedFiles.length - 1]}
        </div>

        {this.getButtons()}
      </>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, exportDialect, navigation } = state
  const { computeDocument } = document
  const { route } = navigation
  return {
    computeDocument,
    exportDialect,
    routeParams: route.routeParams,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  exportDialectProgress,
  exportDialectGetFormattedDocument,
  exportDialectFVGenerateDocumentWithFormat,
  exportDialectGenericError,
  fetchDocument,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportDialect)

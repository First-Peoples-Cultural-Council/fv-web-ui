import React, { Component } from 'react'
// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  exportDialectProgress,
  exportDialectGetFormattedDocument,
  exportDialectFVGenerateDocumentWithFormat,
  exportDialectGenericError,
  exportDialectResetData,
} from 'providers/redux/reducers/exportDialect'
import { fetchDocument } from 'providers/redux/reducers/document'

import Typography from '@material-ui/core/Typography'

import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import FVButton from 'views/components/FVButton'

const { any, string, func, object } = PropTypes
export class ExportDialect extends Component {
  static propTypes = {
    exportDialectExportElement: string,
    exportDialectLabel: string,
    exportDialectQuery: string,
    exportDialectColumns: string,
    // REDUX: reducers/state
    computeDocument: object.isRequired,
    exportDialect: any.isRequired,
    routeParams: object.isRequired,
    // REDUX: actions/dispatch/func
    exportDialectFVGenerateDocumentWithFormat: func.isRequired,
    exportDialectGenericError: func.isRequired,
    exportDialectGetFormattedDocument: func.isRequired,
    exportDialectProgress: func.isRequired,
    exportDialectResetData: func.isRequired,
    fetchDocument: func.isRequired,
  }
  static defaultProps = {
    exportDialectExportElement: 'FVWord',
    exportDialectColumns: '*',
    exportDialectQuery: '*',
  }
  isPolling = false
  pollingInterval = 500
  pollingLimit = 1000 * 60 * 1 // Miliseconds * Seconds/Minute * Minutes

  constructor(props) {
    super(props)
    this.state = {
      dialectId: undefined,
      exportClicked: false,
    }
  }

  async componentDidMount() {
    const { routeParams } = this.props

    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      `${routeParams.dialect_path}/Dictionary`
    )

    if (selectn('isFetching', computeDocument) === false && selectn('success', computeDocument) === false) {
      await this.props.fetchDocument(routeParams.dialect_path + '/Dictionary')
    }

    const dialectId = selectn(['response', 'properties', 'fva:dialect'], computeDocument)
    if (dialectId && this.state.dialectId !== dialectId) {
      this.setState(
        {
          dialectId,
        },
        () => {
          // this.exportDialectCheckPrevious()
        }
      )
    }
  }

  // TODO: Stops polling on unmount but how to handle...
  // TODO: 1) user triggers export
  // TODO: 2) navigates elsewhere
  // TODO: 3) comes back to this page
  componentWillUnmount() {
    this.isPolling = false
    this.props.exportDialectResetData()
  }

  render() {
    const { exportDialect } = this.props
    const { CONSTANTS } = exportDialect
    const { EXPORT_IN_PROGRESS, EXPORT_SUCCESS, EXPORT_ERROR } = CONSTANTS
    const { exportLast = {} } = this.getData()

    const ComponentOuter = (props) => (
      <span>
        {this.generateExportButton()}
        {props.children}
      </span>
    )

    let component = null
    if (this.state.exportClicked) {
      return <ComponentOuter />
    }
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
        component = <ComponentOuter />
    }
    return component
  }

  // exportDialectCheckPrevious = async () => {
  //   const { dialectId } = this.state
  //   if (dialectId) {
  //     await this.props.exportDialectGetFormattedDocument(dialectId, { format: 'CSV' })
  //   }
  // }
  exportDialectProgress = async () => {
    const { exportLast = {} } = this.getData()
    if (exportLast.exportId) {
      await this.props.exportDialectProgress(exportLast.exportId)
    }
  }

  exportDialectRequest = () => {
    this.setState(
      {
        exportClicked: true,
      },
      async () => {
        const { dialectId } = this.state
        const { exportDialectColumns, exportDialectExportElement, exportDialectQuery } = this.props
        await this.props.exportDialectFVGenerateDocumentWithFormat(dialectId, {
          columns: exportDialectColumns,
          exportElement: exportDialectExportElement,
          format: 'CSV',
          query: exportDialectQuery,
        })
        this.setState({
          exportClicked: false,
        })
      }
    )
  }

  generateExportButton = () => {
    const { exportDialectLabel, exportDialect } = this.props
    const { CONSTANTS } = exportDialect
    const { EXPORT_IN_PROGRESS } = CONSTANTS

    const { exportLast } = this.getData()

    const isExporting = this.state.exportClicked || exportLast.lifecycle === EXPORT_IN_PROGRESS

    return (
      <FVButton disabled={isExporting} variant="contained" onClick={this.exportDialectRequest}>
        {isExporting ? 'Exporting...' : `Export${exportDialectLabel ? ` ${exportDialectLabel}` : ''}`}
      </FVButton>
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
        <FVButton href={url} variant="text" component="a" key={index}>
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

  stateIsError = () => {
    const { exportLast } = this.getData()

    const { message } = exportLast
    return (
      <div>
        <Typography variant="body2">{message || "Couldn't export at this time"}</Typography>
      </div>
    )
  }
  stateIsInProgress = () => {
    const { exportLast } = this.getData()

    // const { percentage = 0 } = exportLast

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

    // const progressValue = selectn(['fvexport:progressValue'], exportLast)
    const progressString = selectn(['fvexport:progressString'], exportLast)

    return (
      <div>
        {progressString}
        {/* <div style={{ backgroundColor: 'green', width: `${50}%`, height: '2px' }} /> */}
      </div>
    )
  }

  stateIsSuccess = () => {
    const exportedFiles = this.getExportedFiles()
    return <div>{exportedFiles[exportedFiles.length - 1]}</div>
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
  exportDialectResetData,
  fetchDocument,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportDialect)
